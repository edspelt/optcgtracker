'use client'

import { Tournament, User, Match } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { formatTournamentDuration } from '@/lib/tournament-utils'
import BackButton from '@/components/common/BackButton'
import { useState } from 'react'

type TournamentWithDetails = Tournament & {
  _count: {
    matches: number
    participants: number
  }
  matches: (Match & {
    player1: User
    player2: User
  })[]
  participants: User[]
  createdBy: {
    name: string
    email: string
  }
}

interface TournamentDetailsProps {
  tournament: TournamentWithDetails
  currentUser: User
}

export default function TournamentDetails({ tournament, currentUser }: TournamentDetailsProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  const isParticipant = tournament.participants.some(p => p.id === currentUser.id)

  const handleJoinTournament = async () => {
    try {
      setIsJoining(true)
      setError('')
      
      const response = await fetch(`/api/tournaments/${tournament.id}/join`, {
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
      setIsJoining(false)
    }
  }

  const handleRegisterMatch = () => {
    router.push(`/matches/new?tournamentId=${tournament.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tournament.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Organizado por {tournament.createdBy.name}
            </p>
          </div>
          <BackButton destination="/tournaments/list" label="Volver a torneos" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información del torneo */}
        <div className="col-span-2 bg-white dark:bg-op-dark-lighter shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Información del Torneo</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{tournament.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duración</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatTournamentDuration(tournament)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Participantes</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {tournament._count.participants}
                {tournament.maxPlayers && ` / ${tournament.maxPlayers}`}
              </dd>
            </div>
            {tournament.description && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{tournament.description}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Acciones */}
        <div className="bg-white dark:bg-op-dark-lighter shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Acciones</h2>
          {error && (
            <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
          {!isParticipant && tournament.status === 'UPCOMING' && (
            <button
              onClick={handleJoinTournament}
              disabled={isJoining}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isJoining ? 'Inscribiendo...' : 'Inscribirse'}
            </button>
          )}
          {isParticipant && (
            <div className="space-y-3">
              <div className="p-2 text-sm text-green-700 bg-green-100 rounded dark:bg-green-900 dark:text-green-200">
                Ya estás inscrito en este torneo
              </div>
              <button
                onClick={handleRegisterMatch}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Registrar Partida
              </button>
            </div>
          )}
        </div>

        {/* Últimas partidas */}
        <div className="col-span-2 bg-white dark:bg-op-dark-lighter shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Últimas Partidas</h2>
          {tournament.matches.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tournament.matches.map((match) => (
                <li key={match.id} className="py-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {match.player1.name} vs {match.player2.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {match.player1Leader} vs {match.player2Leader}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay partidas registradas
            </p>
          )}
        </div>

        {/* Lista de participantes */}
        <div className="bg-white dark:bg-op-dark-lighter shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Participantes</h2>
          {tournament.participants.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tournament.participants.map((participant) => (
                <li key={participant.id} className="py-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {participant.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay participantes inscritos
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 