import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Obtener el ID desde la URL
    const url = new URL(req.url)
    const id = url.pathname.split('/').slice(-2, -1)[0] // Extrae el ID dinámico

    const tournament = await prisma.tournament.findUnique({
      where: { id },
    })

    if (!tournament) {
      return NextResponse.json(
        { message: 'Torneo no encontrado' },
        { status: 404 }
      )
    }

    const now = new Date()
    const startDate = new Date(tournament.startDate)
    const endDate = new Date(tournament.endDate)

    let newStatus = tournament.status
    if (now >= startDate && now < endDate) {
      newStatus = 'ONGOING'
    } else if (now >= endDate) {
      newStatus = 'COMPLETED'
    }

    if (newStatus !== tournament.status) {
      await prisma.tournament.update({
        where: { id: tournament.id },
        data: { status: newStatus }
      })
    }

    return NextResponse.json({
      previousStatus: tournament.status,
      currentStatus: newStatus,
      startDate,
      endDate,
      currentDate: now
    })
  } catch (error) {
    console.error('[CHECK_TOURNAMENT_STATUS]', error)
    return NextResponse.json(
      { message: 'Error al verificar el estado del torneo' },
      { status: 500 }
    )
  }
}
