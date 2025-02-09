'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Role } from '@prisma/client'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: '/' 
    })
  }

  // Si está cargando, mostrar un navbar básico
  if (status === 'loading') {
    return (
      <nav className="w-full bg-white dark:bg-op-dark shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                OP TCG
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Si no hay sesión, mostrar navbar para usuarios no autenticados
  if (!session?.user) {
    return (
      <nav className="w-full bg-white dark:bg-op-dark shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                OP TCG
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href="/login"
                className="text-gray-700 hover:text-op-red dark:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="ml-4 bg-gradient-op text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
              >
                Registrarse
              </Link>
            </div>

            {/* Botón de menú móvil */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-op-dark-lighter"
              >
                <span className="sr-only">Abrir menú</span>
                {/* Icono de menú */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Icono de cerrar */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-op-yellow dark:hover:bg-op-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-op-yellow dark:hover:bg-op-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // El resto del código existente para usuarios autenticados...
  const userRole = session.user.role as Role

  const navigationItems = [
    { name: 'Inicio', href: '/dashboard' },
    { name: 'Mis Partidas', href: '/matches' },
    { name: 'Torneos', href: '/tournaments/list' },
    { name: 'Rankings', href: '/rankings' },
    // Enlaces para jueces y admins
    ...(userRole === 'JUDGE' || userRole === 'ADMIN' ? [
      { name: 'Gestionar Torneos', href: '/tournaments/manage' },
      { name: 'Aprobar Partidas', href: '/matches/pending' }
    ] : []),
    // Enlaces solo para admins
    ...(userRole === 'ADMIN' ? [
      { name: 'Gestionar Usuarios', href: '/admin/users' },
      { name: 'Configuración', href: '/admin/settings' }
    ] : [])
  ]

  return (
    <nav className="w-full bg-white dark:bg-op-dark shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
                OP TCG
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-op-red"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Perfil y menú móvil */}
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-op-red dark:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleSignOut}
                className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Botón de menú móvil */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-op-dark-lighter"
              >
                <span className="sr-only">Abrir menú</span>
                {/* Icono de menú */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Icono de cerrar */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-op-yellow dark:hover:bg-op-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-op-yellow dark:hover:bg-op-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 dark:hover:bg-op-dark"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 