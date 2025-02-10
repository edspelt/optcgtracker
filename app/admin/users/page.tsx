import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import UserManagement from '@/components/admin/UserManagement'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Verificar si el usuario es admin
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Obtener la lista completa de usuarios con todos los campos necesarios
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      // No incluimos campos sensibles como password
    }
  })

  // Agregar console.log para debug
  console.log('Users fetched:', users)

  return (
    <div className="p-4">
      <UserManagement users={users} />
    </div>
  )
} 