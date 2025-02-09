'use client'

import { useState } from 'react'
import { User, Tournament } from '@prisma/client'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/common/BackButton'

interface NewMatchFormProps {
  users: Pick<User, 'id' | 'name' | 'email'>[]
  currentUser: User
  preselectedTournament?: Tournament | null
}

export default function NewMatchForm({ users, currentUser, preselectedTournament }: NewMatchFormProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [matchDetails, setMatchDetails] = useState({
    player1Leader: '',
    player2Leader: '',
    result: 'WIN' as const,
    tournamentId: preselectedTournament?.id || '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player2Id: selectedUser.id,
          ...matchDetails
        }),
      })

      if (!response.ok) throw new Error('Error al crear la partida')

      router.push('/matches')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Registrar Nueva Partida
          </h1>
          {preselectedTournament && (
            <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
              Torneo: {preselectedTournament.name}
            </p>
          )}
        </div>
        <BackButton destination="/matches" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Buscador de usuarios */}
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Oponente</label>
          <input
            type="text"
            placeholder="Buscar oponente..."
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="mt-2 border rounded max-h-40 overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  type="button"
                  key={user.id}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-op-dark"
                  onClick={() => {
                    setSelectedUser(user)
                    setSearchTerm('')
                  }}
                >
                  {user.name} ({user.email})
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="p-2 bg-gray-100 dark:bg-op-dark rounded">
            Oponente seleccionado: {selectedUser.name}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Tu Líder</label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            value={matchDetails.player1Leader}
            onChange={(e) => setMatchDetails({...matchDetails, player1Leader: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Líder Oponente</label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            value={matchDetails.player2Leader}
            onChange={(e) => setMatchDetails({...matchDetails, player2Leader: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Resultado</label>
          <select
            required
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            value={matchDetails.result}
            onChange={(e) => setMatchDetails({...matchDetails, result: e.target.value as 'WIN' | 'LOSS'})}
          >
            <option value="WIN">Victoria</option>
            <option value="LOSS">Derrota</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Notas (opcional)</label>
          <textarea
            className="mt-1 w-full p-2 border rounded dark:bg-op-dark"
            value={matchDetails.notes}
            onChange={(e) => setMatchDetails({...matchDetails, notes: e.target.value})}
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
            disabled={!selectedUser || isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Partida'}
          </button>
        </div>
      </form>
    </div>
  )
} 