import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si el usuario está autenticado y es admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No tienes permisos para eliminar usuarios' },
        { status: 401 }
      )
    }

    const userId = (await params).userId

    // Verificar que no se intente eliminar al último admin
    const isLastAdmin = await prisma.user.count({
      where: {
        role: 'ADMIN'
      }
    }) === 1 && (await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    }))?.role === 'ADMIN'

    if (isLastAdmin) {
      return NextResponse.json(
        { message: 'No se puede eliminar el último administrador' },
        { status: 400 }
      )
    }

    // Eliminar el usuario
    await prisma.user.delete({
      where: {
        id: userId
      }
    })

    return NextResponse.json(
      { message: 'Usuario eliminado correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 