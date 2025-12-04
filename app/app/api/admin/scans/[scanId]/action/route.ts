import { NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin'
import { prisma } from '@/lib/db'

/**
 * POST /api/admin/scans/:scanId/action
 * Perform actions on a scan: retry, cancel, delete
 */
export async function POST(
  request: Request,
  { params }: { params: { scanId: string } }
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

    // Verify scan exists
    const scan = await prisma.scanJob.findUnique({
      where: { id: params.scanId },
      select: { id: true, status: true },
    })

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      )
    }

    // Perform action
    switch (action) {
      case 'retry':
        // Re-queue failed or queued scans
        if (!['failed', 'queued'].includes(scan.status)) {
          return NextResponse.json(
            { error: 'Can only retry failed or queued scans' },
            { status: 400 }
          )
        }
        await prisma.scanJob.update({
          where: { id: params.scanId },
          data: { status: 'queued', errorMessage: null },
        })
        // TODO: Add to queue system if needed
        break

      case 'cancel':
        // Cancel running or queued scans
        if (!['running', 'queued'].includes(scan.status)) {
          return NextResponse.json(
            { error: 'Can only cancel running or queued scans' },
            { status: 400 }
          )
        }
        await prisma.scanJob.update({
          where: { id: params.scanId },
          data: { status: 'cancelled' },
        })
        break

      case 'delete':
        // Delete completed or failed scans
        if (!['completed', 'failed', 'cancelled'].includes(scan.status)) {
          return NextResponse.json(
            { error: 'Can only delete completed, failed, or cancelled scans' },
            { status: 400 }
          )
        }
        await prisma.scanJob.delete({
          where: { id: params.scanId },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, action, scanId: params.scanId })
  } catch (error) {
    console.error('Failed to perform scan action:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
