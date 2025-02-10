'use client'

import { useState } from 'react'
import { Role } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  createdAt: Date;
}

interface UserManagementProps {
  users: User[];
}

export default function UserManagement({ users }: UserManagementProps) {
  const [usersState, setUsers] = useState(users)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  console.log('Initial users:', users)
  console.log('Current usersState:', usersState)

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      setIsUpdating(userId)
      const response = await fetch('/api/admin/users/role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el rol')
      }

      setUsers(usersState.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      
      toast.success('Rol actualizado correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el rol')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setIsUpdating(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario')
      }

      setUsers(users.filter(user => user.id !== userId))
      toast.success('Usuario eliminado correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar el usuario')
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Administra los roles de los usuarios registrados
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No hay usuarios para mostrar</p>
        ) : (
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
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Rol Actual
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Cambiar Rol
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Fecha de Registro
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-op-dark">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          <div className="max-w-[200px] overflow-hidden overflow-ellipsis" title={user.name || 'Sin nombre'}>
                            {user.name || 'Sin nombre'}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <div className="max-w-[200px] overflow-hidden overflow-ellipsis" title={user.email || 'Sin email'}>
                            {user.email || 'Sin email'}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {user.role || 'Sin rol'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                            disabled={isUpdating === user.id}
                            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-op-dark-lighter py-1 text-gray-900 dark:text-white shadow-sm focus:border-op-red focus:ring-op-red sm:text-sm"
                          >
                            <option value="PLAYER">Jugador</option>
                            <option value="JUDGE">Juez</option>
                            <option value="ADMIN">Administrador</option>
                          </select>
                          {isUpdating === user.id && (
                            <span className="ml-2 inline-block">⚡</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Sin fecha'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isUpdating === user.id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title="Eliminar usuario"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 