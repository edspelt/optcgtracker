import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { isTournamentActive } from '@/lib/tournament-utils'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' }, 
        { status: 401 }
      )
    }

    const data = await req.json()
    const { player2Id, result, player1Leader, player2Leader, tournamentId, notes } = data

    // Verificar si ya existe una partida pendiente o aprobada entre estos jugadores en el mismo torneo
    const existingMatch = await prisma.match.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                AND: [
                  { player1Id: session.user.id },
                  { player2Id: player2Id }
                ]
              },
              {
                AND: [
                  { player1Id: player2Id },
                  { player2Id: session.user.id }
                ]
              }
            ]
          },
          {
            status: {
              in: ['PENDING', 'APPROVED']
            }
          },
          // Solo verificar el torneo si se está registrando una partida de torneo
          ...(tournamentId ? [{
            tournamentId: tournamentId
          }] : [])
        ]
      }
    })

    if (existingMatch) {
      return NextResponse.json(
        { 
          message: 'Ya existe una partida registrada o pendiente con este jugador en este torneo',
          matchId: existingMatch.id 
        }, 
        { status: 400 }
      )
    }

    // Validaciones
    if (!player2Id) {
      return NextResponse.json(
        { message: 'Debes seleccionar un oponente' }, 
        { status: 400 }
      )
    }

    if (!player1Leader || !player2Leader) {
      return NextResponse.json(
        { message: 'Los líderes son obligatorios' }, 
        { status: 400 }
      )
    }

    // Si hay torneo, verificar que el usuario esté inscrito
    if (tournamentId) {
      const tournament = await prisma.tournament.findFirst({
        where: {
          id: tournamentId,
          status: 'ONGOING',
          participants: {
            some: {
              userId: session.user.id,
              status: 'APPROVED'
            }
          }
        }
      })

      if (!tournament) {
        return NextResponse.json(
          { message: 'No estás inscrito en este torneo o el torneo no está activo' }, 
          { status: 400 }
        )
      }
    }

    // Crear la partida
    const match = await prisma.match.create({
      data: {
        player1Id: session.user.id,
        player2Id,
        result,
        player1Leader,
        player2Leader,
        tournamentId,
        notes,
        status: 'PENDING'
      },
      include: {
        player1: true,
        player2: true,
        tournament: true
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error('[MATCH_CREATE]', error)
    return NextResponse.json(
      { message: 'Error al crear la partida' }, 
      { status: 500 }
    )
  }
} 