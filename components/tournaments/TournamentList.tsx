'use client'

import { TournamentWithDetails } from '@/types'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/common/BackButton'
import { formatTournamentDuration } from '@/lib/tournament-utils'
import { useState } from 'react'

interface TournamentListProps {
  tournaments: TournamentWithDetails[]
  currentUser: User
}

export default function TournamentList({ tournaments, currentUser }: TournamentListProps) {
  const router = useRouter()
  const [joiningTournament, setJoiningTournament] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      setJoiningTournament(tournamentId)
      setError(null)
      
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al inscribirse al torneo')
    } finally {
      setJoiningTournament(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Torneos Disponibles</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Participa en torneos y compite con otros jugadores
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
          <BackButton />
          {(currentUser.role === 'ADMIN' || currentUser.role === 'JUDGE') && (
            <button
              onClick={() => router.push('/tournaments/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Crear Torneo
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => {
          const isParticipant = tournament.participants.some(p => p.id === currentUser.id)
          
          return (
            <div
              key={tournament.id}
              className="bg-white dark:bg-op-dark-lighter shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {tournament.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      por {tournament.createdBy.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    tournament.status === 'UPCOMING' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {tournament.status === 'UPCOMING' ? 'Próximo' : 'En curso'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTournamentDuration(tournament)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Participantes: {tournament._count.participants}
                    {tournament.maxPlayers && ` / ${tournament.maxPlayers}`}
                  </p>
                  {tournament.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {tournament.description}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {error && tournament.id === joiningTournament && (
                    <div className="mb-2 p-2 text-sm text-red-700 bg-red-100 rounded dark:bg-red-900 dark:text-red-200">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={() => isParticipant 
                      ? router.push(`/tournaments/${tournament.id}`)
                      : handleJoinTournament(tournament.id)
                    }
                    disabled={joiningTournament === tournament.id}
                    className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                      isParticipant
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } disabled:opacity-50`}
                  >
                    {joiningTournament === tournament.id 
                      ? 'Inscribiendo...' 
                      : isParticipant 
                        ? 'Ver detalles' 
                        : 'Participar'
                    }
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {tournaments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay torneos disponibles en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 