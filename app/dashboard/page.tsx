import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import WelcomeScreen from '@/components/dashboard/WelcomeScreen'
import DashboardStats from '@/components/dashboard/DashboardStats'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Obtener partidas del usuario
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { player1Id: session.user.id },
        { player2Id: session.user.id }
      ]
    },
    include: {
      tournament: true
    }
  })

  // Obtener ranking del torneo activo (si existe)
  const activeTournament = await prisma.tournament.findFirst({
    where: {
      status: 'ONGOING',
      participants: {
        some: {
          userId: session.user.id,
          status: 'APPROVED'
        }
      }
    },
    include: {
      matches: {
        where: {
          status: 'APPROVED'
        },
        include: {
          player1: true,
          player2: true
        }
      },
      participants: {
        include: {
          user: true
        }
      }
    }
  })

  let tournamentRanking
  if (activeTournament) {
    // Calcular posiciones
    const rankings = activeTournament.participants.map(participant => {
      const playerMatches = activeTournament.matches.filter(match =>
        match.player1Id === participant.userId || match.player2Id === participant.userId
      )
      const wins = playerMatches.filter(match =>
        (match.player1Id === participant.userId && match.result === 'WIN') ||
        (match.player2Id === participant.userId && match.result === 'LOSS')
      ).length

      return {
        userId: participant.userId,
        wins,
        matches: playerMatches.length
      }
    }).sort((a, b) => b.wins - a.wins)

    const userPosition = rankings.findIndex(r => r.userId === session.user.id) + 1
    
    tournamentRanking = {
      position: userPosition,
      totalPlayers: rankings.length,
      tournamentName: activeTournament.name
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WelcomeScreen user={session.user} />
      <DashboardStats 
        user={session.user}
        matches={matches}
        tournamentRanking={tournamentRanking}
      />
    </div>
  )
} 