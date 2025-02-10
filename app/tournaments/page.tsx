import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TournamentList from '@/components/tournaments/TournamentList'

export default async function TournamentsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const tournaments = await prisma.tournament.findMany({
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
    orderBy: { startDate: 'desc' }
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