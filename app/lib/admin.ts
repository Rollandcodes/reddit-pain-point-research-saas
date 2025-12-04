import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from './db'

/**
 * Admin role check - verifies user is an admin in the database
 */
export async function checkAdminAccess() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        authorized: false,
        error: 'Unauthorized',
      }
    }

    // Fetch user from database and check admin role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        id: true,
        role: true,
        status: true,
      },
    })

    if (!user) {
      return {
        authorized: false,
        error: 'User not found',
      }
    }

    if (user.status === 'suspended') {
      return {
        authorized: false,
        error: 'User account is suspended',
      }
    }

    if (user.role !== 'admin') {
      return {
        authorized: false,
        error: 'Insufficient permissions',
      }
    }

    return {
      authorized: true,
      userId: user.id,
      clerkId: userId,
    }
  } catch (error) {
    console.error('Admin access check failed:', error)
    return {
      authorized: false,
      error: 'Access check failed',
    }
  }
}

/**
 * Middleware to protect admin API routes
 */
export function adminRoute(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const access = await checkAdminAccess()

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(req, ...args)
  }
}
