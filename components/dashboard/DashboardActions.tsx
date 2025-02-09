'use client'

import { Role } from '@prisma/client'
import Link from 'next/link'

interface DashboardActionsProps {
  userRole: Role
}

export default function DashboardActions({ userRole }: DashboardActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Acciones para todos los usuarios */}
      <Link
        href="/matches"
        className="p-4 bg-white dark:bg-op-dark-lighter rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-semibold mb-2">Mis Partidas</h3>
        <p className="text-gray-600 dark:text-gray-300">Registra y revisa tus partidas</p>
      </Link>

      <Link
        href="/tournaments/list"
        className="p-4 bg-white dark:bg-op-dark-lighter rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-semibold mb-2">Torneos</h3>
        <p className="text-gray-600 dark:text-gray-300">Ver torneos disponibles</p>
      </Link>

      {/* Acciones para jueces y admins */}
      {(userRole === 'JUDGE' || userRole === 'ADMIN') && (
        <>
          <Link
            href="/tournaments/create"
            className="p-4 bg-white dark:bg-op-dark-lighter rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Crear Torneo</h3>
            <p className="text-gray-600 dark:text-gray-300">Organiza un nuevo torneo</p>
          </Link>

          <Link
            href="/matches/pending"
            className="p-4 bg-white dark:bg-op-dark-lighter rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Aprobar Partidas</h3>
            <p className="text-gray-600 dark:text-gray-300">Revisa y aprueba partidas pendientes</p>
          </Link>
        </>
      )}

      {/* Acciones solo para admins */}
      {userRole === 'ADMIN' && (
        <>
          <Link
            href="/admin/users"
            className="p-4 bg-white dark:bg-op-dark-lighter rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Gestionar Usuarios</h3>
            <p className="text-gray-600 dark:text-gray-300">Administra roles y permisos</p>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 bg-white dark:bg-op-dark-lighter rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Configuración</h3>
            <p className="text-gray-600 dark:text-gray-300">Ajustes del sistema</p>
          </Link>
        </>
      )}
    </div>
  )
} 