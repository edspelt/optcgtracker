'use client'

import { useState } from 'react'
import { Match, User } from '@prisma/client'
import { toast } from 'react-hot-toast'
import { RefreshIcon } from '@heroicons/react/24/outline'

type MatchWithPlayers = Match & {
  player1: User
  player2: User
}

interface PendingMatchesClientProps {
  initialMatches: MatchWithPlayers[]
}

export default function PendingMatchesClient({ initialMatches }: PendingMatchesClientProps) {
  const [matches, setMatches] = useState(initialMatches)
  const [selectedMatch, setSelectedMatch] = useState<MatchWithPlayers | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isReconfirmModalOpen, setIsReconfirmModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [filter, setFilter] = useState('all') // 'all' | 'tournament' | 'friendly'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleAction = (match: MatchWithPlayers, action: 'approve' | 'reject') => {
    setSelectedMatch(match)
    setActionType(action)
    setIsConfirmModalOpen(true)
  }

  const handleFirstConfirm = () => {
    if (actionType === 'approve') {
      // Para aprobación, mostrar segunda confirmación
      setIsConfirmModalOpen(false)
      setIsReconfirmModalOpen(true)
    } else {
      // Para rechazo, proceder normalmente
      confirmAction()
    }
  }

  const confirmAction = async () => {
    if (!selectedMatch || !actionType) return

    try {
      setIsProcessing(true)
      const response = await fetch(`/api/matches/${selectedMatch.id}/${actionType}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error(`Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'} la partida`)
      }

      setMatches(matches.filter(m => m.id !== selectedMatch.id))
      toast.success(actionType === 'approve' ? 'Partida aprobada correctamente' : 'Partida rechazada')
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'} la partida`)
    } finally {
      setIsProcessing(false)
      setIsConfirmModalOpen(false)
      setIsReconfirmModalOpen(false)
      setSelectedMatch(null)
      setActionType(null)
    }
  }

  const closeAllModals = () => {
    setIsConfirmModalOpen(false)
    setIsReconfirmModalOpen(false)
    setSelectedMatch(null)
    setActionType(null)
  }

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  const refreshMatches = async () => {
    try {
      const response = await fetch('/api/matches/pending')
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
        toast.success('Lista actualizada')
      }
    } catch (error) {
      toast.error('Error al actualizar la lista')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Partidas Pendientes de Aprobación
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {matches.length} partida{matches.length !== 1 ? 's' : ''} pendiente{matches.length !== 1 ? 's' : ''} de revisión
      </p>

      <div className="mb-6">
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-op-dark"
        >
          <option value="all">Todas las partidas</option>
          <option value="tournament">Solo torneos</option>
          <option value="friendly">Solo amistosas</option>
        </select>
      </div>

      <div className="space-y-4">
        {matches
          .filter(match => {
            if (filter === 'tournament') return match.tournament
            if (filter === 'friendly') return !match.tournament
            return true
          })
          .map((match) => (
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
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      Torneo: {match.tournament.name}
                    </p>
                  )}
                  <p className="text-sm font-medium mt-1">
                    Resultado: {match.result === 'WIN' ? 
                      `Victoria para ${match.player1.name}` : 
                      `Victoria para ${match.player2.name}`}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Registrada: {new Date(match.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {match.notes && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notas:</span> {match.notes}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(match, 'approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleAction(match, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}

        {matches.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hay partidas pendientes de aprobación
          </p>
        )}
      </div>

      {/* Primer Modal de Confirmación */}
      {isConfirmModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-op-dark-lighter rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {actionType === 'approve' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'} de Partida
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-op-dark rounded-lg">
                <p className="font-medium dark:text-white">Detalles de la partida:</p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    <span className="text-gray-600 dark:text-gray-400">Jugador 1:</span>{' '}
                    <span className="font-medium dark:text-white">{selectedMatch.player1.name}</span>
                    <span className="text-gray-500"> ({selectedMatch.player1Leader})</span>
                  </li>
                  <li>
                    <span className="text-gray-600 dark:text-gray-400">Jugador 2:</span>{' '}
                    <span className="font-medium dark:text-white">{selectedMatch.player2.name}</span>
                    <span className="text-gray-500"> ({selectedMatch.player2Leader})</span>
                  </li>
                  <li>
                    <span className="text-gray-600 dark:text-gray-400">Resultado:</span>{' '}
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {selectedMatch.result === 'WIN' ? 
                        `Victoria para ${selectedMatch.player1.name}` : 
                        `Victoria para ${selectedMatch.player2.name}`}
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Estás seguro de que deseas {actionType === 'approve' ? 'aprobar' : 'rechazar'} esta partida? 
                Esta acción no se puede deshacer.
              </p>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFirstConfirm}
                  disabled={isProcessing}
                  className={`px-4 py-2 text-white rounded disabled:opacity-50 ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Re-confirmación (solo para aprobación) */}
      {isReconfirmModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-op-dark-lighter rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-500">
              ¡ÚLTIMA CONFIRMACIÓN!
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-500">
                <p className="font-bold text-yellow-700 dark:text-yellow-500 mb-2">
                  ¿Estás completamente seguro?
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Vas a aprobar la siguiente partida:
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="font-medium">
                    {selectedMatch.player1.name} vs {selectedMatch.player2.name}
                  </li>
                  <li className="font-medium">
                    Resultado: {selectedMatch.result === 'WIN' ? 
                      `Victoria para ${selectedMatch.player1.name}` : 
                      `Victoria para ${selectedMatch.player2.name}`}
                  </li>
                </ul>
              </div>

              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Esta acción es irreversible y afectará las estadísticas de los jugadores.
              </p>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAction}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                  {isProcessing ? 'Aprobando...' : '¡Sí, Aprobar Definitivamente!'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={refreshMatches}
        className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <RefreshIcon className="h-4 w-4 mr-2" />
        Actualizar
      </button>
    </div>
  )
} 