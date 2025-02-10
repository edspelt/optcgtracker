import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import TournamentForm from '@/components/tournaments/TournamentForm'

export default async function CreateTournamentPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Verificar si el usuario tiene permisos para crear torneos
  if (session.user.role !== 'ADMIN' && session.user.role !== 'JUDGE') {
    redirect('/tournaments/list')
  }

  return <TournamentForm />
} 