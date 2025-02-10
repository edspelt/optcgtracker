'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Match, User, Tournament } from '@prisma/client'
import { toast } from 'react-hot-toast'
import BackButton from '../common/BackButton'

type PendingMatch = Match & {
  player1: Pick<User, 'id' | 'name' | 'email'>
  player2: Pick<User, 'id' | 'name' | 'email'>
  tournament?: Pick<Tournament, 'id' | 'name'> | null
}

interface PendingMatchesClientProps {
  matches: PendingMatch[]
}

export default function PendingMatchesClient({ matches }: PendingMatchesClientProps) {
  const router = useRouter()
  const [processingMatch, setProcessingMatch] = useState<string | null>(null)

  const handleApprove = async (matchId: string) => {
    try {
      setProcessingMatch(matchId)
      
      console.log('Enviando solicitud a:', `/api/matches/${matchId}/approve`)
      
      const response = await fetch(`/api/matches/${matchId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Error al aprobar la partida')
        }
        toast.success('Partida aprobada correctamente')
      } else {
        const text = await response.text()
        console.error('Respuesta no JSON:', text)
        throw new Error('Error inesperado del servidor')
      }

      router.refresh()
    } catch (error) {
      console.error('Error completo:', error)
      toast.error(error instanceof Error ? error.message : 'Error al aprobar la partida')
    } finally {
      setProcessingMatch(null)
    }
  }

  const handleReject = async (matchId: string) => {
    try {
      setProcessingMatch(matchId)
      const response = await fetch(`/api/matches/${matchId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al rechazar la partida')
      }

      toast.success('Partida rechazada correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al rechazar la partida')
    } finally {
      setProcessingMatch(null)
    }
  }

  const sortedMatches = [...matches].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Partidas Pendientes</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Aprueba o rechaza las partidas registradas por los jugadores
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <BackButton />
        </div>
      </div>

      <div className="mt-8">
        {sortedMatches.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No hay partidas pendientes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Jugador 1
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Jugador 2
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Resultado
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Torneo
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Fecha
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedMatches.map((match) => (
                  <tr key={match.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {match.player1.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {match.player2.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {match.result === 'WIN' ? 'Victoria J1' : 'Victoria J2'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {match.tournament?.name || 'Amistoso'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleApprove(match.id)}
                        disabled={processingMatch === match.id}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(match.id)}
                        disabled={processingMatch === match.id}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 