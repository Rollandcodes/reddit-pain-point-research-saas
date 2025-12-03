/**
 * Job Queue Configuration using BullMQ
 * Handles asynchronous task processing with Redis
 */

import { Queue, QueueOptions, Worker, Job } from "bullmq"
import IORedis from "ioredis"

// Redis connection configuration
const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

// Queue options
const queueOptions: QueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000, // Start with 2 seconds, then 4, 8, etc.
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000, // Keep max 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
}

// Create queues
export const scanQueue = new Queue("scan-processing", queueOptions)

// Job data types
export interface ScanJobData {
  scanId: string
  userId: string
  keywords: string
  subreddits?: string
  timeRange: string
}

/**
 * Add a scan job to the queue
 */
export async function enqueueScanJob(data: ScanJobData) {
  const job = await scanQueue.add("process-scan", data, {
    priority: 1, // Higher priority for new scans
    jobId: `scan-${data.scanId}`, // Use scanId as jobId to prevent duplicates
  })

  return job
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  const job = await scanQueue.getJob(jobId)
  if (!job) {
    return null
  }

  const state = await job.getState()
  const progress = job.progress
  const returnvalue = job.returnvalue
  const failedReason = job.failedReason

  return {
    id: job.id,
    state,
    progress,
    returnvalue,
    failedReason,
    data: job.data,
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    scanQueue.getWaitingCount(),
    scanQueue.getActiveCount(),
    scanQueue.getCompletedCount(),
    scanQueue.getFailedCount(),
    scanQueue.getDelayedCount(),
  ])

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  }
}

/**
 * Clean up old jobs
 */
export async function cleanQueue() {
  await scanQueue.clean(0, 1000, "completed")
  await scanQueue.clean(0, 100, "failed")
}

/**
 * Close queue connections (for graceful shutdown)
 */
export async function closeQueues() {
  await scanQueue.close()
  await connection.quit()
}

// Export connection for worker
export { connection }

