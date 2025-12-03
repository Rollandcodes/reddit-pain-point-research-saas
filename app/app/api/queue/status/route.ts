import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { getQueueStats, getJobStatus } from "@/lib/queue"

/**
 * GET /api/queue/status
 * Get queue statistics and job status
 */
export async function GET(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    // If jobId provided, return specific job status
    if (jobId) {
      const jobStatus = await getJobStatus(jobId)
      if (!jobStatus) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 })
      }
      return NextResponse.json({ job: jobStatus })
    }

    // Otherwise return queue statistics
    const stats = await getQueueStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Queue status error:", error)
    return NextResponse.json(
      { error: "Failed to get queue status" },
      { status: 500 }
    )
  }
}

