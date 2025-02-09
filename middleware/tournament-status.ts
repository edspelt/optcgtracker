import { prisma } from '@/lib/prisma'

export async function updateTournamentStatuses() {
  const now = new Date()
  console.log('DEBUG - Actualizando estados, fecha actual:', now)

  // Actualizar torneos que deberían estar en curso
  const tourneosParaActualizar = await prisma.tournament.findMany({
    where: {
      status: 'UPCOMING',
      startDate: {
        lte: now
      },
      endDate: {
        gt: now
      }
    }
  })

  console.log('DEBUG - Torneos para actualizar a ONGOING:', tourneosParaActualizar)

  if (tourneosParaActualizar.length > 0) {
    const updatedToOngoing = await prisma.tournament.updateMany({
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

    console.log('DEBUG - Torneos actualizados a ONGOING:', updatedToOngoing.count)
  }

  // Actualizar torneos que deberían estar completados
  const tourneosParaCompletar = await prisma.tournament.findMany({
    where: {
      status: 'ONGOING',
      endDate: {
        lte: now
      }
    }
  })

  console.log('DEBUG - Torneos para actualizar a COMPLETED:', tourneosParaCompletar)

  if (tourneosParaCompletar.length > 0) {
    const updatedToCompleted = await prisma.tournament.updateMany({
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

    console.log('DEBUG - Torneos actualizados a COMPLETED:', updatedToCompleted.count)
  }
} 