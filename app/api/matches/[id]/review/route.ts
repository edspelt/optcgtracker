import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { canApproveMatches } from '@/middleware/permissions'

export async function PATCH(req: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !canApproveMatches(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 })
    }

    const match = await prisma.match.update({
      where: { id: context.params.id },
      data: {
        status,
        approvedById: session.user.id
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error('[MATCH_REVIEW]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
