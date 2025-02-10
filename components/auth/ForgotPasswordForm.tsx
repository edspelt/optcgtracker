'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { validateEmail } from '@/lib/validations'

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el email')
      }

      setEmailSent(true)
      toast.success('Email enviado correctamente')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar el email')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4 mb-4">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Email enviado
          </h3>
          <p className="mt-2 text-sm text-green-700 dark:text-green-300">
            Hemos enviado un enlace de recuperación a {email}. 
            Por favor, revisa tu bandeja de entrada.
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
          <button
            onClick={() => setEmailSent(false)}
            className="text-op-red hover:text-op-red-dark dark:hover:text-op-yellow"
          >
            intenta nuevamente
          </button>
        </p>
      </div>
    )
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-3">
            <p className="text-sm text-red-500 dark:text-red-200">
              {error}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={50}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-op-dark dark:text-white`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim())
                setError('')
              }}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-op hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-op-red disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </div>
            ) : (
              'Enviar enlace de recuperación'
            )}
          </button>
        </div>
      </div>
    </form>
  )
} 