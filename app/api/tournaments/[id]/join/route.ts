import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json({ message: 'Torneo no encontrado' }, { status: 404 })
    }

    // Verificar si el torneo está lleno
    if (tournament.maxPlayers && tournament._count.participants >= tournament.maxPlayers) {
      return NextResponse.json({ message: 'El torneo está lleno' }, { status: 400 })
    }

    // Crear la participación
    const participation = await prisma.tournamentParticipant.create({
      data: {
        tournamentId: params.id,
        userId: session.user.id,
        status: 'APPROVED' // O 'PENDING' si requiere aprobación
      },
      include: {
        tournament: true
      }
    })

    return NextResponse.json(participation)
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Ya estás inscrito en este torneo' },
        { status: 400 }
      )
    }
    console.error('[TOURNAMENT_JOIN]', error)
    return NextResponse.json(
      { message: 'Error al inscribirse al torneo' },
      { status: 500 }
    )
  }
} 