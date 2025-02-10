import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario está autenticado y es admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role || !Object.values(Role).includes(role)) {
      return new NextResponse('Invalid request data', { status: 400 })
    }

    // Actualizar el rol del usuario
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        role: role as Role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user role:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 