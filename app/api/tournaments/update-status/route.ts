import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const now = new Date()

    // Actualizar torneos que deberían estar en curso
    await prisma.tournament.updateMany({
      where: {
        status: 'UPCOMING',
        startDate: {
          lte: now
        },
        endDate: {
          gt: now
        }
      },
      data: {
        status: 'ONGOING'
      }
    })

    // Actualizar torneos que deberían estar completados
    await prisma.tournament.updateMany({
      where: {
        status: 'ONGOING',
        endDate: {
          lte: now
        }
      },
      data: {
        status: 'COMPLETED'
      }
    })

    return NextResponse.json({ message: 'Estados actualizados correctamente' })
  } catch (error) {
    console.error('[UPDATE_TOURNAMENT_STATUS]', error)
    return new NextResponse(
      JSON.stringify({ message: 'Error al actualizar estados' }), 
      { status: 500 }
    )
  }
} 