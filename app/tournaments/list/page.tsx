import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TournamentList from '@/components/tournaments/TournamentList'
import { updateTournamentStatuses } from '@/middleware/tournament-status'

export default async function TournamentsListPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Actualizar estados antes de obtener la lista
  await updateTournamentStatuses()

  const tournaments = await prisma.tournament.findMany({
    where: {
      OR: [
        { status: 'UPCOMING' },
        { status: 'ONGOING' }
      ]
    },
    include: {
      _count: {
        select: {
          participants: true,
          matches: true
        }
      },
      participants: {
        where: {
          userId: session.user.id
        },
        select: {
          userId: true
        }
      },
      createdBy: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  })

  // Transformar los datos para el componente
  const transformedTournaments = tournaments.map(tournament => ({
    ...tournament,
    participants: tournament.participants.map(p => ({ id: p.userId }))
  }))

  return <TournamentList tournaments={transformedTournaments} currentUser={session.user} />
} 