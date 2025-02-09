'use client'

import { useState } from 'react'
import { User, Role } from '@prisma/client'
import { useRouter } from 'next/navigation'

type UserWithoutPassword = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>

interface UserManagementProps {
  users: UserWithoutPassword[]
}

export default function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

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

      if (!response.ok) throw new Error('Error al actualizar el rol')

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      // Aquí podrías mostrar una notificación de error
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Usuarios</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Lista de todos los usuarios registrados y sus roles
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-op-dark-lighter">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Usuario
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Rol
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Fecha de registro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-op-dark">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {user.email}
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
                          <span className="ml-2 inline-block animate-spin">⚡</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
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