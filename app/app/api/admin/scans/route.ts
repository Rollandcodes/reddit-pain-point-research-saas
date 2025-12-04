import { NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/scans
 * Returns paginated scan list
 * Query params: ?page=1&limit=10&status=completed
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
    const status = searchParams.get('status')

    // Build filter
    const where = status ? { status } : {}

    // Fetch scans with user information
    const scans = await prisma.scanJob.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // Get total count
    const total = await prisma.scanJob.count({ where })

    // Format response
    const formattedScans = scans.map((scan) => ({
      id: scan.id,
      subreddit: scan.subreddits || 'Unknown',
      username: scan.user?.name || 'Unknown',
      status: scan.status,
      painPoints: scan.totalClusters || 0,
      solutions: scan.totalPostsAnalyzed || 0,
      duration: scan.duration || 0,
      completedAt: scan.completedAt ? scan.completedAt.toISOString() : scan.createdAt.toISOString(),
    }))

    return NextResponse.json({
      scans: formattedScans,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error('Failed to fetch scans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scans' },
      { status: 500 }
    )
  }
}
