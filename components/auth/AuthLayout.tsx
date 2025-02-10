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
    <div className="min-h-screen flex">
      {/* Panel lateral con imagen/diseño */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-op-red to-op-yellow">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="p-12 text-center">
            <Image
              src="/images/logo.png" // Asegúrate de tener este archivo
              alt="OP TCG Tracker Logo"
              width={200}
              height={200}
              className="mx-auto mb-8"
            />
            <h2 className="text-4xl font-bold text-white mb-4">
              OP TCG Tracker
            </h2>
            <p className="text-white/90 text-lg">
              La mejor plataforma para gestionar tus partidas de One Piece TCG
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-op-dark">
        <div className="max-w-md w-full space-y-8">
          {/* Logo para móvil */}
          <div className="lg:hidden text-center">
            <Image
              src="/images/logo.png"
              alt="OP TCG Tracker Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="text-center mt-4">
            <Link
              href={linkHref as Route}
              className="text-sm text-op-red hover:text-op-red-dark dark:hover:text-op-yellow transition-colors"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 