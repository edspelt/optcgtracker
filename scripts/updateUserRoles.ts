import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Actualizar todos los usuarios con rol USER a PLAYER
    await prisma.user.updateMany({
      where: {
        role: Role.PLAYER  // o el valor que esté actualmente
      },
      data: {
        role: Role.PLAYER
      }
    })

    console.log('Roles de usuario actualizados correctamente')
  } catch (error) {
    console.error('Error al actualizar roles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 