'use client'

import { useState } from 'react'
import { Match, User, Tournament } from '@prisma/client'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/common/BackButton'

type MatchWithDetails = Match & {
  player1: User
  player2: User
  tournament?: Tournament | null
}

interface PendingMatchesManagementProps {
  matches: MatchWithDetails[]
}

export default function PendingMatchesManagement({ matches: initialMatches }: PendingMatchesManagementProps) {
  const [matches, setMatches] = useState(initialMatches)
  const [processingMatch, setProcessingMatch] = useState<string | null>(null)
  const router = useRouter()

  const handleMatchAction = async (matchId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      setProcessingMatch(matchId)
      const response = await fetch(`/api/matches/${matchId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      })

      if (!response.ok) throw new Error('Error al procesar la partida')

      setMatches(matches.filter(match => match.id !== matchId))
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setProcessingMatch(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Partidas Pendientes de Aprobación
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Revisa y aprueba las partidas registradas por los jugadores
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <BackButton />
        </div>
      </div>

      <div className="space-y-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white dark:bg-op-dark-lighter shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {match.player1.name} vs {match.player2.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {match.player1Leader} vs {match.player2Leader}
                </p>
                {match.tournament && (
                  <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
                    Torneo: {match.tournament.name}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Resultado: {match.result === 'WIN' ? 
                    `Victoria para ${match.player1.name}` : 
                    `Victoria para ${match.player2.name}`}
                </p>
                {match.notes && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Notas: {match.notes}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(match.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => handleMatchAction(match.id, 'REJECTED')}
                disabled={processingMatch === match.id}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Rechazar
              </button>
              <button
                onClick={() => handleMatchAction(match.id, 'APPROVED')}
                disabled={processingMatch === match.id}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Aprobar
              </button>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay partidas pendientes de aprobación
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 