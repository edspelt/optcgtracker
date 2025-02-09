import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import NewMatchForm from '@/components/matches/NewMatchForm'

export default async function NewMatchPage({
  searchParams
}: {
  searchParams: { tournamentId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Obtener usuarios para el buscador (excluyendo al usuario actual)
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: session.user.id
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  // Si hay un torneo especificado, verificar que el usuario esté inscrito
  let tournament = null
  if (searchParams.tournamentId) {
    tournament = await prisma.tournament.findFirst({
      where: {
        id: searchParams.tournamentId,
        status: 'ONGOING',
        participants: {
          some: {
            userId: session.user.id,
            status: 'APPROVED'
          }
        }
      }
    })

    if (!tournament) {
      redirect('/matches')
    }
  }

  return (
    <NewMatchForm 
      users={users} 
      currentUser={session.user}
      preselectedTournament={tournament}
    />
  )
} 