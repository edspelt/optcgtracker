import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = user.password
          ? await compare(credentials.password, user.password)
          : false;

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name ?? '',
          role: user.role,
          emailVerified: user.emailVerified ?? null, // Añadir propiedades faltantes
          image: user.image ?? null,
          password: user.password ?? null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        role: token.role
      }
    }),
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          role: user.role
        }
      }
      return token
    }
  }
}
