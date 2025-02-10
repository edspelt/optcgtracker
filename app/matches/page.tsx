import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import MatchesClient from '@/components/matches/MatchesClient'
import { prisma } from '@/lib/prisma'

export default async function MatchesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Obtener las partidas del usuario
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { player1Id: session.user.id },
        { player2Id: session.user.id }
      ]
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

  // Obtener usuarios para el selector de oponentes
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: session.user.id // Excluir al usuario actual
      }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  // Obtener torneos disponibles
  const tournaments = await prisma.tournament.findMany({
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
      participants: {
        select: {
          userId: true,
          status: true
        }
      },
      _count: {
        select: {
          matches: true,
          participants: true
        }
      }
    }
  })

  const transformedMatches = matches.map(match => ({
    ...match,
    tournament: match.tournament || undefined
  }));

  return (
    <MatchesClient 
      initialMatches={transformedMatches}
      users={users}
      currentUser={session.user}
      tournaments={tournaments}
    />
  )
} 