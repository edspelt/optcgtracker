import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManageTournaments } from '@/middleware/permissions'
import TournamentManagement from '@/components/tournaments/TournamentManagement'

export default async function ManageTournamentsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !canManageTournaments(session.user.role)) {
    redirect('/dashboard')
  }

  const tournaments = await prisma.tournament.findMany({
    where: {
      createdById: session.user.id
    },
    include: {
      _count: {
        select: {
          matches: true,
          participants: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <TournamentManagement tournaments={tournaments} />
} 