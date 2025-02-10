'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { validateEmail, validatePassword } from '@/lib/validations'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const validateName = (name: string): string | null => {
    if (!name) return 'El nombre es requerido'
    if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres'
    if (name.length > 50) return 'El nombre no puede tener más de 50 caracteres'
    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(name)) return 'El nombre solo puede contener letras'
    return null
  }

  const validateForm = (): boolean => {
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    let confirmPasswordError = null

    if (formData.password !== formData.confirmPassword) {
      confirmPasswordError = 'Las contraseñas no coinciden'
    }

    setErrors({
      name: nameError || '',
      email: emailError || '',
      password: passwordError || '',
      confirmPassword: confirmPasswordError || ''
    })

    return !nameError && !emailError && !passwordError && !confirmPasswordError
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Prevenir espacios en tiempo real para email y contraseñas
    const cleanValue = ['email', 'password', 'confirmPassword'].includes(name) 
      ? value.trim() 
      : value
    setFormData(prev => ({ ...prev, [name]: cleanValue }))
    
    // Limpiar error al escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar usuario')
      }

      // Iniciar sesión automáticamente
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error('Error al iniciar sesión')
      }

      toast.success('Registro exitoso')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={50}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-op-dark dark:text-white`}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        </div>

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
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
              autoComplete="new-password"
              required
              maxLength={50}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-op-dark dark:text-white`}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              maxLength={50}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-op-dark dark:text-white`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
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
                Registrando...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-op-red hover:text-op-red-dark dark:hover:text-op-yellow"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </form>
  )
} 