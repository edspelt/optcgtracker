import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'

export async function checkRole(requiredRoles: Role[]) {
  const session = await getServerSession()
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const userRole = session.user.role as Role

  if (!requiredRoles.includes(userRole)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
}

export function isAdmin(role: Role): boolean {
  return role === 'ADMIN'
}

export function isJudge(role: Role): boolean {
  return role === 'JUDGE' || role === 'ADMIN'
}

export function canManageTournaments(role: Role): boolean {
  return ['JUDGE', 'ADMIN'].includes(role)
}

export function canApproveMatches(role: Role): boolean {
  return ['JUDGE', 'ADMIN'].includes(role)
} 