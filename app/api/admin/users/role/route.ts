import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { isAdmin } from '@/middleware/permissions'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !isAdmin(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { userId, role } = body

    // Validar que no se pueda cambiar el rol del último admin
    if (role !== 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })

      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (adminCount === 1 && targetUser?.role === 'ADMIN') {
        return new NextResponse(
          'No se puede cambiar el rol del último administrador',
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[USER_ROLE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 