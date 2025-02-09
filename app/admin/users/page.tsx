import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import UserManagement from '@/components/admin/UserManagement'
import { isAdmin } from '@/middleware/permissions'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !isAdmin(session.user.role)) {
    redirect('/dashboard')
  }

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
    }
  })

  return <UserManagement users={users} />
} 