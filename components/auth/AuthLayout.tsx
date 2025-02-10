'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LinkProps } from 'next/link'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  linkText?: string
  linkHref?: LinkProps<string>['href']
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  linkText, 
  linkHref = '/' 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-op-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-op-dark-lighter py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}

          {linkText && linkHref && (
            <div className="mt-6 text-center text-sm">
              <Link 
                href={linkHref}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {linkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 