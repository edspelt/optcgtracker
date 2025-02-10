import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TournamentList from '@/components/tournaments/TournamentList'
import { updateTournamentStatuses } from '@/middleware/tournament-status'
import { TournamentWithDetails } from '@/types'

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
      participants: {
        include: {
          user: true
        }
      },
      _count: {
        select: {
          matches: true,
          participants: true
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

  // Transformar los datos para que coincidan con el tipo esperado
  const transformedTournaments: TournamentWithDetails[] = tournaments.map(tournament => ({
    id: tournament.id,
    name: tournament.name,
    status: tournament.status,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    duration: tournament.duration,
    description: tournament.description,
    maxPlayers: tournament.maxPlayers,
    createdById: tournament.createdById,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
    _count: {
      participants: tournament._count.participants,
      matches: tournament._count.matches
    },
    participants: tournament.participants.map(participant => participant.user),
    createdBy: {
      name: tournament.createdBy.name
    }
  }))

  return <TournamentList tournaments={transformedTournaments} currentUser={session.user} />
} 