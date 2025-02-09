'use client'

import { useState, useEffect } from 'react'
import { User, Tournament, Match } from '@prisma/client'

type RankingPlayer = {
  user: User
  matches: number
  wins: number
  losses: number
  winRate: number
}

interface TournamentRankingProps {
  tournament: Tournament & {
    matches: (Match & {
      player1: User
      player2: User
    })[]
    participants: {
      user: User
    }[]
  }
}

export default function TournamentRanking({ tournament }: TournamentRankingProps) {
  const [rankings, setRankings] = useState<RankingPlayer[]>([])

  useEffect(() => {
    // Calcular estadísticas para cada participante
    const playerStats = new Map<string, RankingPlayer>()

    // Inicializar estadísticas para todos los participantes
    tournament.participants.forEach(({ user }) => {
      playerStats.set(user.id, {
        user,
        matches: 0,
        wins: 0,
        losses: 0,
        winRate: 0
      })
    })

    // Calcular estadísticas basadas en partidas aprobadas
    tournament.matches.forEach(match => {
      if (match.status !== 'APPROVED') return

      // Actualizar estadísticas del jugador 1
      const player1Stats = playerStats.get(match.player1Id)
      if (player1Stats) {
        player1Stats.matches++
        if (match.result === 'WIN') {
          player1Stats.wins++
        } else {
          player1Stats.losses++
        }
        player1Stats.winRate = (player1Stats.wins / player1Stats.matches) * 100
      }

      // Actualizar estadísticas del jugador 2
      const player2Stats = playerStats.get(match.player2Id)
      if (player2Stats) {
        player2Stats.matches++
        if (match.result === 'LOSS') {
          player2Stats.wins++
        } else {
          player2Stats.losses++
        }
        player2Stats.winRate = (player2Stats.wins / player2Stats.matches) * 100
      }
    })

    // Convertir a array y ordenar por victorias y porcentaje de victorias
    const rankingsList = Array.from(playerStats.values()).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.winRate - a.winRate
    })

    setRankings(rankingsList)
  }, [tournament])

  return (
    <div className="bg-white dark:bg-op-dark-lighter shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Ranking del Torneo: {tournament.name}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Clasificación actual de los participantes
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-op-dark">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Posición
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jugador
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Partidas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Victorias
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Derrotas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % Victoria
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-op-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
            {rankings.map((player, index) => (
              <tr key={player.user.id} className={index % 2 === 0 ? 'bg-white dark:bg-op-dark-lighter' : 'bg-gray-50 dark:bg-op-dark'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}º
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {player.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {player.matches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  {player.wins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                  {player.losses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {player.winRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rankings.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay partidas registradas en este torneo
        </div>
      )}
    </div>
  )
} 