import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import NewMatchForm from '@/components/matches/NewMatchForm';

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    // Resolver la promesa de searchParams
    const params = await searchParams;

    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);

    // Si no hay sesión, redirigir al login
    if (!session?.user?.id) {
      redirect('/login');
      return null;
    }

    // Obtener usuarios para el buscador (excluyendo al usuario actual)
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Verificar si el usuario está inscrito en el torneo especificado
    let tournament = null;
    const tournamentId = params.tournamentId as string | undefined;

    if (tournamentId) {
      tournament = await prisma.tournament.findFirst({
        where: {
          id: tournamentId,
          status: 'ONGOING',
          participants: {
            some: {
              userId: session.user.id,
              status: 'APPROVED',
            },
          },
        },
      });

      // Si no está inscrito en el torneo, redirigir a la página de partidos
      if (!tournament) {
        redirect('/matches');
        return null;
      }
    }

    // Renderizar el formulario de nuevo partido
    return (
      <NewMatchForm
        users={users}
        currentUser={session.user}
        preselectedTournament={tournament}
      />
    );
  } catch (error) {
    // Manejar errores y redirigir a una página de error
    console.error('Error loading NewMatchPage:', error);
    redirect('/error');
    return null;
  }
}