'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { validateEmail, validatePassword } from '@/lib/validations'

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    auth: ''
  })

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    setErrors({
      email: emailError || '',
      password: passwordError || '',
      auth: ''
    })

    return !emailError && !passwordError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsLoading(true)
      setErrors(prev => ({ ...prev, auth: '' }))

      const result = await signIn('credentials', {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setErrors(prev => ({ ...prev, auth: 'Email o contraseña incorrectos' }))
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setErrors(prev => ({ ...prev, auth: 'Error al iniciar sesión' }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Prevenir espacios en tiempo real
    const cleanValue = name === 'password' ? value : value.trim()
    setFormData(prev => ({ ...prev, [name]: cleanValue }))
    
    // Limpiar error al escribir
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {errors.auth && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-3">
            <p className="text-sm text-red-500 dark:text-red-200">
              {errors.auth}
            </p>
          </div>
        )}

        {/* Email */}
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
                errors.email || errors.auth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-op-dark dark:text-white`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              maxLength={50}
              className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm ${
                errors.password || errors.auth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-op-dark dark:text-white`}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
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
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </div>
    </form>
  )
} 