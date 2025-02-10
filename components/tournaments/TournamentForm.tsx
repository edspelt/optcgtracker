'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TournamentDuration } from '@prisma/client'
import { toast } from 'react-hot-toast'
import BackButton from '@/components/common/BackButton'

export default function TournamentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 'WEEKLY' as TournamentDuration,
    maxPlayers: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el torneo')
      }

      toast.success('Torneo creado correctamente')
      router.push('/tournaments/list')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al crear el torneo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Crear Nuevo Torneo
          </h1>
        </div>
        <BackButton destination="/tournaments/list" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">
            Nombre del Torneo
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">
            Fecha de Inicio
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">
            Fecha de Fin
          </label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">
            Duración
          </label>
          <select
            required
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value as TournamentDuration })}
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
          >
            <option value="WEEKLY">Semanal</option>
            <option value="MONTHLY">Mensual</option>
            <option value="SEASONAL">Por Temporada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">
            Máximo de Jugadores (opcional)
          </label>
          <input
            type="number"
            value={formData.maxPlayers}
            onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            min="2"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando...' : 'Crear Torneo'}
          </button>
        </div>
      </form>
    </div>
  )
} 