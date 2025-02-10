'use client'

import { type Session } from 'next-auth'
import { Match, TournamentRanking } from '@prisma/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrophyIcon, ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline'

interface DashboardStatsProps {
  user: Session['user']
  matches: Match[]
  tournamentRanking: (TournamentRanking & {
    tournament: {
      name: string
      participants: {
        userId: string
      }[]
    }
  }) | null
}

export default function DashboardStats({
  user,
  matches,
  tournamentRanking
}: DashboardStatsProps) {
  // Calcular estadísticas
  const approvedMatches = matches.filter(match => match.status === 'APPROVED')
  const totalMatches = approvedMatches.length
  const wins = approvedMatches.filter(match => 
    (match.player1Id === user.id && match.result === 'WIN') ||
    (match.player2Id === user.id && match.result === 'LOSS')
  ).length
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-op-dark-lighter p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold dark:text-white">Estadísticas</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMatches}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Partidas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{wins}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Victorias</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{winRate}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-op-dark-lighter p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <TrophyIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold dark:text-white">Ranking Actual</h3>
          </div>
          {tournamentRanking ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tournamentRanking.tournament.name}
              </p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {tournamentRanking.position}º
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  de {tournamentRanking.tournament.participants.length} participantes
                </span>
              </div>
            </div>
          ) : (
            <div className="h-[72px] flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              No participas en ningún torneo activo
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-op-dark-lighter p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <PlusIcon className="h-6 w-6 text-op-red dark:text-op-yellow" />
            <h3 className="text-lg font-semibold dark:text-white">Acciones Rápidas</h3>
          </div>
          <div className="space-y-3">
            <Link
              href="/matches?action=new"
              className="block w-full px-4 py-2 bg-gradient-op text-white rounded-lg text-center text-sm hover:opacity-90 transition-all"
            >
              Registrar Partida
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/tournaments/list"
                className="px-3 py-2 bg-gray-100 dark:bg-op-dark text-gray-700 dark:text-gray-300 rounded-lg text-center text-sm hover:bg-gray-200 dark:hover:bg-op-dark-lighter transition-all"
              >
                Ver Torneos
              </Link>
              <Link
                href="/rankings"
                className="px-3 py-2 bg-gray-100 dark:bg-op-dark text-gray-700 dark:text-gray-300 rounded-lg text-center text-sm hover:bg-gray-200 dark:hover:bg-op-dark-lighter transition-all"
              >
                Rankings
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Últimas Partidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-op-dark-lighter p-6 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Últimas Partidas</h3>
        <div className="space-y-3">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-op-dark rounded-lg"
            >
              <div>
                <p className="font-medium dark:text-white">
                  {match.player1Leader} vs {match.player2Leader}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(match.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                match.result === 'WIN' ? 
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {match.result === 'WIN' ? 'Victoria' : 'Derrota'}
              </span>
            </div>
          ))}
          <Link
            href="/matches"
            className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4"
          >
            Ver todas las partidas →
          </Link>
        </div>
      </motion.div>
    </div>
  )
} 