'use client'

import { motion } from 'framer-motion'
import { User } from '@prisma/client'

interface WelcomeScreenProps {
  user: User
}

export default function WelcomeScreen({ user }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        ¡Bienvenido, {user.name}!
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Gestiona tus partidas y sigue tu progreso en los torneos.
      </p>
    </motion.div>
  )
} 