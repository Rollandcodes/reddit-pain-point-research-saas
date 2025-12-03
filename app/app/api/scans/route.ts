import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { prisma } from "@/lib/db"
import { scanSchema, RATE_LIMITS } from "@/lib/validations"
import { trackServerEvent } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scans = await prisma.scanJob.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        clusters: {
          select: {
            id: true,
            name: true,
            opportunityScore: true,
          },
          orderBy: { opportunityScore: "desc" },
          take: 3,
        },
      },
    })

    return NextResponse.json({ scans })
  } catch (error) {
    console.error("Get scans error:", error)
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const result = scanSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { keywords, subreddits, timeRange } = result.data

    // Check rate limit (scans in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentScans = await prisma.scanJob.count({
      where: {
        userId,
        createdAt: { gte: oneDayAgo },
      },
    })

    if (recentScans >= RATE_LIMITS.SCANS_PER_DAY) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Maximum ${RATE_LIMITS.SCANS_PER_DAY} scans per day.` },
        { status: 429 }
      )
    }

    // Validate subreddit count
    if (subreddits) {
      const subredditList = subreddits.split(",").map(s => s.trim()).filter(Boolean)
      if (subredditList.length > RATE_LIMITS.MAX_SUBREDDITS) {
        return NextResponse.json(
          { error: `Maximum ${RATE_LIMITS.MAX_SUBREDDITS} subreddits allowed.` },
          { status: 400 }
        )
      }
    }

    // Create scan job
    const scanJob = await prisma.scanJob.create({
      data: {
        userId,
        keywords,
        subreddits,
        timeRange,
        status: "queued",
      },
    })

    // Track event
    await trackServerEvent("scan_created", userId, {
      scanId: scanJob.id,
      timeRange,
      hasSubreddits: !!subreddits,
    })

    // TODO: Trigger background job to process scan
    // For now, we'll process synchronously in a separate endpoint

    return NextResponse.json(
      { success: true, scanId: scanJob.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create scan error:", error)
    return NextResponse.json(
      { error: "Failed to create scan" },
      { status: 500 }
    )
  }
}
