'use client'

interface BackButtonProps {
  destination?: string
  className?: string
  label?: string
}

export default function BackButton({ destination = '/', className = '', label = 'Volver' }: BackButtonProps) {

  const handleClick = () => {
    // Usar window.location.href en lugar de router.push
    window.location.href = destination
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-op-dark-lighter dark:text-gray-200 dark:border-gray-600 dark:hover:bg-op-dark ${className}`}
    >
      <svg 
        className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
          clipRule="evenodd" 
        />
      </svg>
      {label}
    </button>
  )
} 