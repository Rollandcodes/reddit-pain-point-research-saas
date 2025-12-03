#!/usr/bin/env node
/**
 * Start the scan processing worker
 * Run this script to start processing background jobs
 * 
 * Usage: npm run worker
 * or: tsx scripts/start-worker.ts
 */

import "../workers/scan-worker"

// Keep the process alive
console.log("Worker process started. Press Ctrl+C to stop.")

