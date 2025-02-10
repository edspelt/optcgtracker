import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PendingMatchesClient from '@/components/matches/PendingMatchesClient'

export default async function ApprovePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Verificar si el usuario es JUDGE o ADMIN
  if (!['ADMIN', 'JUDGE'].includes(session.user.role)) {
    redirect('/dashboard')
  }

  // Obtener las partidas pendientes
  const pendingMatches = await prisma.match.findMany({
    where: {
      status: 'PENDING'
    },
    include: {
      player1: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      player2: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tournament: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <PendingMatchesClient matches={pendingMatches} />
} 