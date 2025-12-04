/**
 * Scan Processing Worker
 * Processes scan jobs from the queue asynchronously
 */

import { Worker, Job } from "bullmq"
import { connection } from "@/lib/queue"
import type { ScanJobData } from "@/lib/queue"
import { prisma } from "@/lib/db"
import { redditClient } from "@/lib/reddit-client"
import { clusterPainPoints } from "@/lib/cluster-engine"
import { sendScanCompleteEmail, sendScanFailedEmail } from "@/lib/email"
import { clerkClient } from "@clerk/nextjs/server"
import { config } from "@/lib/config"

// Worker options
const workerOptions = {
  connection,
  concurrency: 2, // Process 2 scans concurrently
  limiter: {
    max: 5, // Max 5 jobs
    duration: 60000, // Per 60 seconds (rate limiting)
  },
}

// Create worker
const worker = new Worker<ScanJobData>(
  "scan-processing",
  async (job: Job<ScanJobData>) => {
    const { scanId, keywords, subreddits, timeRange } = job.data

    console.log(`[Worker] Processing scan ${scanId}`)

    try {
      // Update scan status to running
      await prisma.scanJob.update({
        where: { id: scanId },
        data: { status: "running" },
      })

      // Update job progress
      await job.updateProgress(10)

      // Parse subreddits
      const subredditList = subreddits
        ? subreddits.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined

      // Convert timeRange to days for Reddit API
      const timeRangeMap: Record<string, "day" | "week" | "month" | "year" | "all"> = {
        "7": "week",
        "30": "month",
        "90": "month",
        "365": "year",
      }
      const redditTimeRange = timeRangeMap[timeRange] || "month"

      // Update progress
      await job.updateProgress(20)

      // Search Reddit for posts and comments
      console.log(`[Worker] Searching Reddit for: ${keywords}`)
      const searchResults = await redditClient.search(keywords, {
        subreddits: subredditList,
        timeRange: redditTimeRange,
        maxPosts: 100,
        commentsPerPost: 20,
      })

      await job.updateProgress(50)

      const totalPosts = searchResults.posts.length
      const totalComments = searchResults.comments.length

      console.log(
        `[Worker] Found ${totalPosts} posts and ${totalComments} comments`
      )

      // Update progress
      await job.updateProgress(60)

      // Cluster pain points
      console.log(`[Worker] Clustering pain points...`)
      const clusters = await clusterPainPoints(
        searchResults.posts,
        searchResults.comments
      )

      await job.updateProgress(80)

      // Save clusters to database
      console.log(`[Worker] Saving ${clusters.length} clusters to database`)
      for (const cluster of clusters) {
        const dbCluster = await prisma.cluster.create({
          data: {
            scanJobId: scanId,
            name: cluster.name,
            description: cluster.description,
            postCount: cluster.items.filter((i) => i.source === "post").length,
            averageSentiment: cluster.sentiment,
            opportunityScore: cluster.opportunityScore,
            examples: {
              create: cluster.items.slice(0, 5).map((item) => ({
                sourceUrl: item.sourceUrl,
                quoteText: item.text.substring(0, 500), // Limit quote length
                sentiment: cluster.sentiment,
              })),
            },
          },
        })

        console.log(`[Worker] Created cluster: ${dbCluster.name}`)
      }

      await job.updateProgress(90)

      // Update scan job with results
      await prisma.scanJob.update({
        where: { id: scanId },
        data: {
          status: "completed",
          totalPostsAnalyzed: totalPosts + totalComments,
          totalClusters: clusters.length,
          completedAt: new Date(),
        },
      })

      await job.updateProgress(100)

      console.log(`[Worker] Scan ${scanId} completed successfully`)

      // Send completion email notification
      try {
        const scan = await prisma.scanJob.findUnique({ where: { id: scanId } })
        if (scan?.userId) {
          const user = await clerkClient.users.getUser(scan.userId)
          const userEmail = user.emailAddresses[0]?.emailAddress
          
          if (userEmail) {
            await sendScanCompleteEmail(userEmail, {
              userName: user.firstName || 'there',
              scanId: scan.id,
              subreddit: subredditList?.[0] || 'multiple subreddits',
              painPointsFound: clusters.length,
              viewUrl: `${config.appUrl}/dashboard/scans/${scan.id}`,
            })
            console.log(`[Worker] Sent completion email to ${userEmail}`)
          }
        }
      } catch (emailError) {
        console.error('[Worker] Failed to send completion email:', emailError)
        // Don't fail the job if email fails
      }

      return {
        success: true,
        scanId,
        totalPosts,
        totalComments,
        clustersCount: clusters.length,
      }
    } catch (error) {
      console.error(`[Worker] Error processing scan ${scanId}:`, error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

      // Update scan job with error
      await prisma.scanJob.update({
        where: { id: scanId },
        data: {
          status: "failed",
          errorMessage,
        },
      })

      // Send failure email notification
      try {
        const scan = await prisma.scanJob.findUnique({ where: { id: scanId } })
        if (scan?.userId) {
          const user = await clerkClient.users.getUser(scan.userId)
          const userEmail = user.emailAddresses[0]?.emailAddress
          
          if (userEmail) {
            await sendScanFailedEmail(userEmail, {
              userName: user.firstName || 'there',
              scanId: scan.id,
              subreddit: subreddits || 'unknown',
              errorMessage,
              supportUrl: `${config.appUrl}/support`,
            })
            console.log(`[Worker] Sent failure email to ${userEmail}`)
          }
        }
      } catch (emailError) {
        console.error('[Worker] Failed to send failure email:', emailError)
        // Don't fail the job if email fails
      }

      // Re-throw to mark job as failed
      throw error
    }
  },
  workerOptions
)

// Worker event handlers
worker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed`)
})

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message)
})

worker.on("error", (err) => {
  console.error(`[Worker] Error:`, err)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[Worker] SIGTERM received, closing worker...")
  await worker.close()
  await connection.quit()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.log("[Worker] SIGINT received, closing worker...")
  await worker.close()
  await connection.quit()
  process.exit(0)
})

console.log("[Worker] Scan worker started and ready to process jobs")

// Export worker for testing
export { worker }

