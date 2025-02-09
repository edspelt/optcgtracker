'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
  linkText: string
  linkHref: string
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            TCG Tracker
          </h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
          
          <div className="mt-6 text-center text-sm">
            <Link 
              href={linkHref}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 