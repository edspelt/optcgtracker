import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TournamentList from '@/components/tournaments/TournamentList'
import { updateTournamentStatuses } from '@/middleware/tournament-status'

export default async function TournamentsListPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Actualizar estados antes de obtener la lista
  await updateTournamentStatuses()

  const tournaments = await prisma.tournament.findMany({
    where: {
      status: {
        in: ['UPCOMING', 'ONGOING']
      }
    },
    include: {
      participants: {
        select: {
          id: true,
          userId: true,
          status: true
        }
      },
      createdBy: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          participants: true
        }
      }
    },
    orderBy: { startDate: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <TournamentList
        tournaments={tournaments}
        currentUser={session.user}
      />
    </div>
  )
} 