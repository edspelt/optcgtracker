import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import TournamentDetails from '@/components/tournaments/TournamentDetails'
import { updateTournamentStatuses } from '@/middleware/tournament-status'
import TournamentRanking from '@/components/tournaments/TournamentRanking'

export default async function TournamentPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Actualizar estados antes de obtener el torneo
  await updateTournamentStatuses()

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: params.id
    },
    include: {
      _count: {
        select: {
          matches: true,
          participants: true
        }
      },
      matches: {
        include: {
          player1: true,
          player2: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
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
    }
  })

  if (!tournament) {
    redirect('/tournaments/list')
  }

  const transformedTournament = {
    ...tournament,
    participants: tournament.participants.map(p => p.user)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Información del torneo */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tournament.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organizado por {tournament.createdBy.name}
          </p>
        </div>

        {/* Ranking */}
        <TournamentRanking tournament={tournament} />
      </div>
    </div>
  )
} 