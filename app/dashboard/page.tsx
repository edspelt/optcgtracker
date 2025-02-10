import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import WelcomeScreen from '@/components/dashboard/WelcomeScreen'
import DashboardStats from '@/components/dashboard/DashboardStats'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Obtener partidas y ranking con el nombre del torneo
  const [matches, tournamentRanking] = await Promise.all([
    prisma.match.findMany({
      where: {
        OR: [
          { player1Id: session.user.id },
          { player2Id: session.user.id }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.tournamentRanking.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        tournament: {
          select: {
            name: true,
            participants: {
              select: {
                userId: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeScreen user={session.user} />
      <DashboardStats 
        user={session.user}
        matches={matches}
        tournamentRanking={tournamentRanking}
      />
    </div>
  )
} 