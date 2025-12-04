import { NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin'
import { prisma } from '@/lib/db'

/**
 * POST /api/admin/users/:userId/action
 * Perform actions on a user: suspend, unsuspend, delete, promote
 */
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const access = await checkAdminAccess()

  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { action } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Perform action
    switch (action) {
      case 'suspend':
        await prisma.user.update({
          where: { id: params.userId },
          data: { status: 'suspended' },
        })
        break
      case 'unsuspend':
        await prisma.user.update({
          where: { id: params.userId },
          data: { status: 'active' },
        })
        break
      case 'delete':
        await prisma.user.delete({
          where: { id: params.userId },
        })
        break
      case 'promote':
        await prisma.user.update({
          where: { id: params.userId },
          data: { role: 'admin' },
        })
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, action, userId: params.userId })
  } catch (error) {
    console.error('Failed to perform user action:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
