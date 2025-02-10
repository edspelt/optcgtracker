import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateTournamentStatuses } from '@/middleware/tournament-status'
import TournamentRanking from '@/components/tournaments/TournamentRanking'

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Resolver la promesa de params
  const resolvedParams = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
    return null;
  }

  // Actualizar estados antes de obtener el torneo
  await updateTournamentStatuses();

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: resolvedParams.id,
    },
    include: {
      _count: {
        select: {
          matches: true,
          participants: true,
        },
      },
      matches: {
        include: {
          player1: true,
          player2: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      participants: {
        include: {
          user: true,
        },
      },
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!tournament) {
    redirect('/tournaments/list');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Información del torneo */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tournament.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organizado por {tournament.createdBy.name}
          </p>
        </div>

        {/* Ranking */}
        <TournamentRanking tournament={tournament} />
      </div>
    </div>
  );
}
