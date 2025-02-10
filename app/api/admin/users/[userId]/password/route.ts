import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { validatePassword } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session) // Debug

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const userId = (await params).userId
    const { password } = await request.json()
    console.log('Updating password for user:', userId) // Debug

    const passwordError = validatePassword(password)
    if (passwordError) {
      console.log('Password validation error:', passwordError) // Debug
      return NextResponse.json(
        { message: passwordError },
        { status: 400 }
      )
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.log('User not found:', userId) // Debug
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const hashedPassword = await hash(password, 12)
    console.log('Password hashed successfully') // Debug

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { id: true, email: true } // No seleccionamos el password por seguridad
    })

    console.log('User updated successfully:', updatedUser.id) // Debug

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor', error: String(error) },
      { status: 500 }
    )
  }
} 