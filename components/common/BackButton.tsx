'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  destination?: string
  label?: string
  className?: string
}

export default function BackButton({ 
  destination = '/dashboard', 
  label = 'Volver al inicio',
  className = ''
}: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(destination)}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-op-dark-lighter dark:text-gray-200 dark:border-gray-600 dark:hover:bg-op-dark ${className}`}
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      {label}
    </button>
  )
} 