import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session)

    if (!session?.user || !['ADMIN', 'JUDGE'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'No tienes permisos para aprobar partidas' },
        { status: 401 }
      )
    }

    const matchId = (await params).id
    console.log('Procesando match:', matchId)

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'APPROVED',
        approvedById: session.user.id
      },
      include: {
        player1: true,
        player2: true,
        tournament: true
      }
    })

    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error('Error completo:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 