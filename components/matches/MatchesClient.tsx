'use client'

import { useState } from 'react'
import { User, Match, Tournament } from '@prisma/client'
import { formatTournamentDuration, getRemainingDays } from '@/lib/tournament-utils'
import BackButton from '@/components/common/BackButton'
import { toast } from 'react-hot-toast'

type MatchWithPlayers = Match & {
  player1: User
  player2: User
  tournament?: Tournament
}

type TournamentWithParticipants = Tournament & {
  participants: {
    userId: string
    status: string
  }[]
  _count: {
    matches: number
    participants: number
  }
}

interface MatchesClientProps {
  initialMatches: MatchWithPlayers[]
  users: Pick<User, 'id' | 'name' | 'email'>[]
  currentUser: User
  tournaments: TournamentWithParticipants[]
}

export default function MatchesClient({ 
  initialMatches, 
  users, 
  currentUser,
  tournaments 
}: MatchesClientProps) {
  const [matches, setMatches] = useState(initialMatches)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [matchDetails, setMatchDetails] = useState({
    player1Leader: '',
    player2Leader: '',
    result: 'WIN' as const,
    tournamentId: '',
    notes: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debug de los torneos recibidos
  console.log('DEBUG - MatchesClient recibió:', {
    torneosRecibidos: tournaments.map(t => ({
      id: t.id,
      name: t.name,
      status: t.status,
      participantes: t.participants.map(p => ({
        userId: p.userId,
        status: p.status
      }))
    })),
    usuarioActual: currentUser.id
  })

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const availableTournaments = tournaments.filter(tournament => {
    const isEligible = tournament.status === 'ONGOING' && 
      tournament.participants.some(p => 
        p.userId === currentUser.id && 
        p.status === 'APPROVED'
      )

    console.log('DEBUG - Evaluando torneo:', {
      torneoId: tournament.id,
      nombre: tournament.name,
      estado: tournament.status,
      participantes: tournament.participants,
      usuarioActual: currentUser.id,
      esElegible: isEligible
    })

    return isEligible
  })

  const handleCreateMatch = async () => {
    if (!selectedUser) {
      setError('Debes seleccionar un oponente')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const matchData = {
        ...matchDetails,
        player2Id: selectedUser.id
      }

      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData)
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.matchId) {
          setError(`${data.message}. Por favor, espera a que la partida existente sea aprobada o rechazada.`)
        } else {
          setError(data.message || 'Error al crear la partida')
        }
        return
      }

      // Actualizar la lista de partidas
      setMatches([data, ...matches])
      
      // Limpiar el formulario
      setMatchDetails({
        player1Leader: '',
        player2Leader: '',
        result: 'WIN',
        tournamentId: '',
        notes: ''
      })
      setSelectedUser(null)
      setIsCreating(false)

      // Mostrar mensaje de éxito
      toast.success('Partida registrada correctamente')
    } catch (error) {
      console.error('Error:', error)
      setError('Error al crear la partida')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mis Partidas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona tus partidas y resultados</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
          <BackButton />
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Nueva Partida
          </button>
        </div>
      </div>

      {/* Modal de creación de partida */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-op-dark-lighter rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Registrar Nueva Partida</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Buscador de usuarios */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar oponente..."
                className="w-full p-2 border rounded dark:bg-op-dark"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="mt-2 border rounded max-h-40 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-op-dark"
                      onClick={() => {
                        setSelectedUser(user)
                        setSearchTerm('')
                      }}
                    >
                      {user.name} ({user.email})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="mb-4 p-2 bg-gray-100 dark:bg-op-dark rounded">
                Oponente seleccionado: {selectedUser.name}
              </div>
            )}

            {/* Formulario de detalles */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Tu Líder</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={matchDetails.player1Leader}
                  onChange={(e) => setMatchDetails({...matchDetails, player1Leader: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Líder Oponente</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={matchDetails.player2Leader}
                  onChange={(e) => setMatchDetails({...matchDetails, player2Leader: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Resultado</label>
                <select
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={matchDetails.result}
                  onChange={(e) => setMatchDetails({...matchDetails, result: e.target.value as 'WIN' | 'LOSS'})}
                >
                  <option value="WIN">Victoria</option>
                  <option value="LOSS">Derrota</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Torneo</label>
                <select
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={matchDetails.tournamentId}
                  onChange={(e) => setMatchDetails({...matchDetails, tournamentId: e.target.value})}
                >
                  <option value="">Sin torneo</option>
                  {availableTournaments.length > 0 ? (
                    availableTournaments.map(tournament => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay torneos disponibles</option>
                  )}
                </select>
                {matchDetails.tournamentId && availableTournaments.length > 0 && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formatTournamentDuration(
                      availableTournaments.find(t => t.id === matchDetails.tournamentId)!
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Notas</label>
                <textarea
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={matchDetails.notes}
                  onChange={(e) => setMatchDetails({...matchDetails, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsCreating(false)
                  setError('')
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateMatch}
                disabled={!selectedUser || isSubmitting}
                className="px-4 py-2 bg-gradient-op text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Partida'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de partidas */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="border rounded-lg p-4 bg-white dark:bg-op-dark-lighter shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium dark:text-white">
                  {match.player1.name} vs {match.player2.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {match.player1Leader} vs {match.player2Leader}
                </p>
                {match.tournament && (
                  <div className="mt-1">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      Torneo: {match.tournament.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTournamentDuration(match.tournament)}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <div className="text-lg font-bold dark:text-white">
                  {match.result === 'WIN' ? 'Victoria' : 'Derrota'}
                </div>
                {match.tournament && (
                  <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                    {match.tournament.status === 'COMPLETED' ? 'Torneo Finalizado' : 
                     `${getRemainingDays(match.tournament)} días restantes`}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-sm px-2 py-1 rounded ${
                match.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                match.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {match.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(match.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 