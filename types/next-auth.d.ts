import 'next-auth'
import { User as PrismaUser, Role } from '@prisma/client'

declare module 'next-auth' {
  interface User extends Omit<PrismaUser, 'password'> {}

  interface Session {
    user: {
      id: string
      name: string | null
      email: string
      role: Role
      image?: string | null
      emailVerified?: Date | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
  }
}
