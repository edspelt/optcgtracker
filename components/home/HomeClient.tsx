'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function HomeClient() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-op-yellow/5 via-white to-op-red/5 dark:from-op-dark-light dark:via-op-dark dark:to-op-dark-lighter">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-gray-900 dark:text-white mb-2">
              Domina tus partidas de
            </span>
            <span className="gradient-text">
              One Piece TCG
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            La herramienta definitiva para jugadores de One Piece TCG. 
            Registra tus partidas, analiza tu rendimiento y mejora tu estrategia.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-op text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center group"
            >
              Comenzar Gratis
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-op-dark-lighter text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-op-dark transition-all font-medium text-lg shadow-lg"
            >
              Iniciar Sesión
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white/80 dark:bg-op-dark-lighter/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-op rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">⚔️</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Registro de Partidas
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Registra tus duelos, líderes utilizados y resultados de manera sencilla.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-op-dark-lighter/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-op rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Torneos y Rankings
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Participa en torneos y sigue tu posición en el ranking global.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-op-dark-lighter/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-op rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Estadísticas Detalladas
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Analiza tu rendimiento y mejora tu estrategia con datos precisos.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 dark:bg-op-dark/90 border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">OPTCG Tracker</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tu compañero para el seguimiento de partidas de One Piece TCG
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Comunidad</h3>
              <div className="flex space-x-6">
                <a 
                  href="#" 
                  className="text-gray-600 dark:text-gray-300 hover:text-op-red dark:hover:text-op-yellow transition-colors"
                >
                  Discord
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 dark:text-gray-300 hover:text-op-red dark:hover:text-op-yellow transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} H20nte Trade Store
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 