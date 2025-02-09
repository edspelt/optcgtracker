import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { canApproveMatches } from '@/middleware/permissions'

type Props = {
  params: {
    id: string
  }
}

export async function PATCH(
  request: Request,
  props: Props
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || !canApproveMatches(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 })
    }

    const match = await prisma.match.update({
      where: { id: props.params.id },
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