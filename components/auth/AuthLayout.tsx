'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Route } from 'next'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  linkText: string
  linkHref: Route | string
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Panel lateral con imagen/diseño */}
      <div className="lg:w-1/2 bg-gradient-to-br from-op-red to-op-yellow py-8 lg:py-0">
        <div className="flex flex-col justify-center items-center h-full w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md">
            {/* Logo visible en todos los tamaños */}
            <Image
              src="/images/logo.png"
              alt="OP TCG Tracker Logo"
              width={150}
              height={150}
              className="mx-auto mb-6 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
              priority
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              OP TCG Tracker
            </h2>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-sm mx-auto">
              La mejor plataforma para gestionar tus partidas de One Piece TCG
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-gray-50 dark:bg-op-dark">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          {/* Contenedor del formulario con scroll si es necesario */}
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-1">
            {children}
          </div>

          <div className="text-center pt-4 sm:pt-6">
            <Link
              href={linkHref as Route}
              className="text-sm sm:text-base text-op-red hover:text-op-red-dark dark:hover:text-op-yellow transition-colors"
            >
              {linkText}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} H20nte Trade Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
} 