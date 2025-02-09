import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canApproveMatches } from '@/middleware/permissions'
import PendingMatchesManagement from '@/components/matches/PendingMatchesManagement'

export default async function PendingMatchesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !canApproveMatches(session.user.role)) {
    redirect('/dashboard')
  }

  const pendingMatches = await prisma.match.findMany({
    where: {
      status: 'PENDING'
    },
    include: {
      player1: true,
      player2: true,
      tournament: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <PendingMatchesManagement matches={pendingMatches} />
} 