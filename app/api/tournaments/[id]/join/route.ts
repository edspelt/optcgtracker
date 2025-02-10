import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Obtener el ID del torneo desde la URL
    const url = new URL(req.url)
    const id = url.pathname.split('/').slice(-2, -1)[0] // Extrae el ID dinámico

    const tournament = await prisma.tournament.findUnique({
      where: { id },
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
        tournamentId: id,
        userId: session.user.id,
        status: 'APPROVED' // O 'PENDING' si requiere aprobación
      },
      include: {
        tournament: true
      }
    })

    return NextResponse.json(participation)
  } catch (error) { 
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string } // Definimos un tipo más específico
  
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { message: 'Ya estás inscrito en este torneo' },
          { status: 400 }
        )
      }
    }
  
    console.error('[TOURNAMENT_JOIN]', error)
    return NextResponse.json(
      { message: 'Error al inscribirse al torneo' },
      { status: 500 }
    )
  }
}
