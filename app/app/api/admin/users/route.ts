import { NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

/**
 * GET /api/admin/users
 * Returns paginated user list
 * Query params: ?page=1&limit=10&search=query
 */
export async function GET(request: Request) {
  const access = await checkAdminAccess()

  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // Build search filter with proper types
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}

    // Fetch users with scan counts
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,
        lastActive: true,
        _count: {
          select: { scanJobs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get total count
    const total = await prisma.user.count({ where })

    // Format response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      status: user.status,
      role: user.role,
      scans: user._count.scanJobs,
      joinedDate: user.createdAt.toISOString(),
      lastActive: user.lastActive ? user.lastActive.toISOString() : user.createdAt.toISOString(),
    }))

    return NextResponse.json({
      users: formattedUsers,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
