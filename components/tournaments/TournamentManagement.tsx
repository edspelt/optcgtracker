'use client'

import { useState } from 'react'
import { Tournament, TournamentDuration } from '@prisma/client'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/common/BackButton'

type TournamentWithCounts = Tournament & {
  _count?: {
    participants: number
    matches: number
  }
}

interface TournamentManagementProps {
  tournaments: TournamentWithCounts[]
}

export default function TournamentManagement({ tournaments: initialTournaments }: TournamentManagementProps) {
  const [tournaments, setTournaments] = useState(initialTournaments)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 'WEEKLY' as TournamentDuration,
    maxPlayers: ''
  })
  const router = useRouter()

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del torneo es obligatorio')
      return false
    }
    if (!formData.startDate) {
      setError('La fecha de inicio es obligatoria')
      return false
    }
    if (!formData.endDate) {
      setError('La fecha de fin es obligatoria')
      return false
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxPlayers: formData.maxPlayers ? parseInt(formData.maxPlayers) : null
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el torneo')
      }

      setTournaments([data, ...tournaments])
      setIsCreating(false)
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        duration: 'WEEKLY',
        maxPlayers: ''
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error al crear el torneo')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestión de Torneos</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Administra tus torneos y sus participantes
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
          <BackButton />
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Crear Torneo
          </button>
        </div>
      </div>

      {/* Modal de creación */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-op-dark-lighter rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Crear Nuevo Torneo</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Descripción</label>
                <textarea
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-200">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-200">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">Duración</label>
                <select
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value as TournamentDuration})}
                >
                  <option value="WEEKLY">Semanal</option>
                  <option value="MONTHLY">Mensual</option>
                  <option value="SEASONAL">Temporada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-200">
                  Límite de Participantes
                </label>
                <input
                  type="number"
                  min="2"
                  className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({...formData, maxPlayers: e.target.value})}
                  placeholder="Opcional"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Deja en blanco para no establecer límite
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setError('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Crear Torneo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de torneos */}
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-op-dark-lighter">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Nombre
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Estado
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Participantes
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Partidas
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Duración
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-op-dark">
                  {tournaments.map((tournament) => (
                    <tr key={tournament.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {tournament.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {tournament.status}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {tournament._count?.participants || 0}
                        {tournament.maxPlayers && ` / ${tournament.maxPlayers}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {tournament._count?.matches || 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {tournament.duration}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => router.push(`/tournaments/${tournament.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 