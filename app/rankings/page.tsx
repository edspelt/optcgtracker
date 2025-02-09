import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import TournamentRanking from '@/components/tournaments/TournamentRanking'

export default async function RankingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Obtener torneos activos y completados con sus partidas y participantes
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: {
        in: ['ONGOING', 'COMPLETED']
      }
    },
    include: {
      matches: {
        include: {
          player1: true,
          player2: true
        }
      },
      participants: {
        include: {
          user: true
        }
      },
      createdBy: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      status: 'asc' // ONGOING primero, luego COMPLETED
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Rankings de Torneos
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Clasificaciones de todos los torneos activos y completados
        </p>
      </div>

      <div className="space-y-12">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="space-y-4">
            <div className="flex items-center space-x-2">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tournament.status === 'ONGOING' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {tournament.status === 'ONGOING' ? 'En Curso' : 'Completado'}
              </span>
            </div>
            
            <TournamentRanking tournament={tournament} />
          </div>
        ))}

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay torneos activos o completados
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 