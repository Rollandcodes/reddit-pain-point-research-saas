import { NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/stats
 * Returns dashboard statistics
 */
export async function GET() {
  const access = await checkAdminAccess()

  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalScans,
      activeUsers,
      completedScans,
      failedScans,
      avgDurationResult,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.scanJob.count(),
      prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.scanJob.count({ where: { status: 'completed' } }),
      prisma.scanJob.count({ where: { status: 'failed' } }),
      prisma.scanJob.aggregate({
        _avg: { duration: true },
        where: { status: 'completed' },
      }),
    ])

    const successRate =
      totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 0
    const avgDuration = Math.round(avgDurationResult._avg.duration || 0)

    return NextResponse.json({
      totalUsers,
      totalScans,
      activeUsers,
      avgResponseTime: avgDuration,
      successRate,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
