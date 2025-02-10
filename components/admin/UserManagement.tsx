'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { toast } from 'react-hot-toast'
import { TrashIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { validatePassword } from '@/lib/validations'

interface UserManagementProps {
  users: User[]
}

interface UserModalProps {
  user: User
  onClose: () => void
  onPasswordChange: (userId: string, newPassword: string) => Promise<void>
}

function UserModal({ user, onClose, onPasswordChange }: UserModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }

    try {
      setIsLoading(true)
      setError('')
      await onPasswordChange(user.id, newPassword)
      setNewPassword('')
      toast.success('Contraseña actualizada correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (newRole: string) => {
    try {
      setIsUpdatingRole(true)
      setError('')

      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al actualizar el rol')
      }

      setSelectedRole(newRole as User['role'])
      toast.success('Rol actualizado correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el rol')
    } finally {
      setIsUpdatingRole(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-op-dark-lighter rounded-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Información del Usuario
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.name || 'Sin nombre'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rol
            </label>
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              disabled={isUpdatingRole || user.role === 'ADMIN'}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm rounded-md dark:bg-op-dark dark:border-gray-600 dark:text-white"
            >
              <option value="PLAYER">Jugador</option>
              <option value="JUDGE">Juez</option>
              <option value="ADMIN">Administrador</option>
            </select>
            {user.role === 'ADMIN' && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No se puede modificar el rol de un administrador
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de registro
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Formulario de cambio de contraseña */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nueva Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setError('')
                }}
                className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-op-red focus:border-op-red sm:text-sm dark:bg-op-dark dark:border-gray-600 dark:text-white"
                placeholder="Nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !newPassword}
              className="bg-gradient-op text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

    try {
      setIsDeleting(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al eliminar usuario')
      }

      setUsers(users.filter(user => user.id !== userId))
      toast.success('Usuario eliminado correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar usuario')
    } finally {
      setIsDeleting(null)
    }
  }

  const handlePasswordChange = async (userId: string, newPassword: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error response:', data) // Debug
        throw new Error(data.message || 'Error al actualizar la contraseña')
      }

      // Si llegamos aquí, la contraseña se actualizó correctamente
      console.log('Password updated successfully') // Debug
    } catch (error) {
      console.error('Error in handlePasswordChange:', error) // Debug
      throw error
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Administra los usuarios de la plataforma
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="w-full max-w-md px-4 py-2 border rounded-lg dark:bg-op-dark dark:border-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de usuarios - Responsive */}
      <div className="bg-white dark:bg-op-dark-lighter shadow overflow-hidden rounded-lg">
        {/* Vista móvil */}
        <div className="block sm:hidden">
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              className="p-4 border-b dark:border-gray-700 last:border-0"
            >
              <div className="flex justify-between items-start">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex-1 text-left"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {user.name || 'Sin nombre'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Rol: {user.role}
                  </p>
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={isDeleting === user.id || user.role === 'ADMIN'}
                  className={`p-2 rounded-full ${
                    user.role === 'ADMIN'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vista tablet/desktop */}
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-op-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-op-dark-lighter divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr 
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-op-dark-light cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || 'Sin nombre'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : user.role === 'JUDGE'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteUser(user.id)
                      }}
                      disabled={isDeleting === user.id || user.role === 'ADMIN'}
                      className={`inline-flex items-center p-2 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                      }`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje si no hay usuarios */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron usuarios
          </div>
        )}
      </div>

      {/* Modal de usuario */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onPasswordChange={handlePasswordChange}
        />
      )}
    </div>
  )
} 