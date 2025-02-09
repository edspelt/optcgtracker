import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserRoles() {
  try {
    // Actualizar todos los usuarios con role 'USER' a 'PLAYER'
    await prisma.user.updateMany({
      where: {
        role: 'USER'
      },
      data: {
        role: 'PLAYER'
      }
    })
    
    console.log('Roles de usuarios actualizados correctamente')
  } catch (error) {
    console.error('Error actualizando roles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserRoles() 