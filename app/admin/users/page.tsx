import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UserManagement from '@/components/admin/UserManagement'
import type { User } from '@prisma/client'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  // Obtener todos los campos necesarios del usuario
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      password: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  }) as User[]

  return (
    <div className="p-4">
      <UserManagement users={users} />
    </div>
  )
} 