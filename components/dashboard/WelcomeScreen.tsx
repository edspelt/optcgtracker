'use client'

import { motion } from 'framer-motion';
import { Session } from 'next-auth';

// Definimos el tipo Role basado en los valores que recibes de la base de datos
type Role = 'ADMIN' | 'PLAYER' | 'JUDGE'; // Ajusta estos valores según tu base de datos

interface WelcomeScreenProps {
  user: Session['user'] & {
    id: string;
    role: Role;
  };
}

// Función para obtener el mensaje de bienvenida según el rol
const getWelcomeMessage = (role: Role, userName: string | null | undefined) => {
  switch (role) {
    case 'ADMIN':
      return `¡Bienvenido, ${userName ?? 'Administrador'}! Tienes acceso completo al sistema.`;
    case 'PLAYER':
      return `¡Bienvenido, ${userName ?? 'Jugador'}! Gestiona tus partidas y sigue tu progreso en los torneos.`;
    case 'JUDGE':
      return `¡Bienvenido, ${userName ?? 'Espectador'}! Explora y sigue los torneos en vivo.`;
    default:
      return `¡Bienvenido, ${userName ?? 'Invitado'}!`;
  }
};

export default function WelcomeScreen({ user }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8 space-y-2"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {getWelcomeMessage(user.role, user.name)}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {user.role === 'admin'
          ? 'Puedes gestionar usuarios, partidas y torneos.'
          : user.role === 'player'
          ? 'Revisa tus próximas partidas y mejora tu ranking.'
          : 'Disfruta de los torneos y sigue a tus jugadores favoritos.'}
      </p>
    </motion.div>
  );
}