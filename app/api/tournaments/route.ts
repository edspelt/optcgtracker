import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { canManageTournaments } from '@/middleware/permissions'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !canManageTournaments(session.user.role)) {
      return new NextResponse(
        JSON.stringify({ message: 'No tienes permisos para crear torneos' }), 
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, startDate, endDate, description, maxPlayers, duration } = body

    // Validaciones
    if (!name?.trim()) {
      return new NextResponse(
        JSON.stringify({ message: 'El nombre es obligatorio' }), 
        { status: 400 }
      )
    }

    if (!startDate || !endDate) {
      return new NextResponse(
        JSON.stringify({ message: 'Las fechas son obligatorias' }), 
        { status: 400 }
      )
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return new NextResponse(
        JSON.stringify({ message: 'La fecha de fin debe ser posterior a la fecha de inicio' }), 
        { status: 400 }
      )
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        maxPlayers: maxPlayers ? parseInt(maxPlayers) : null,
        duration,
        createdById: session.user.id,
        status: 'UPCOMING'
      },
      include: {
        _count: {
          select: {
            matches: true,
            participants: true
          }
        }
      }
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('[TOURNAMENTS_POST]', error)
    return new NextResponse(
      JSON.stringify({ message: 'Error al crear el torneo' }), 
      { status: 500 }
    )
  }
} 