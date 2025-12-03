# Background Job Queue Setup

This application uses **BullMQ** with **Redis** to process background jobs asynchronously. This allows scan processing to happen in the background without blocking the API.

## Architecture

- **Queue**: Stores jobs waiting to be processed (Redis)
- **Worker**: Processes jobs from the queue asynchronously
- **API**: Enqueues jobs when scans are created

## Prerequisites

1. **Redis Server**: You need a Redis instance running
   - Local: Install Redis locally or use Docker
   - Production: Use a managed Redis service (Redis Cloud, AWS ElastiCache, etc.)

## Setup

### 1. Install Redis (Local Development)

**Using Docker:**
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

**Using Homebrew (macOS):**
```bash
brew install redis
brew services start redis
```

**Using apt (Ubuntu/Debian):**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional, leave empty for local development
```

For production (e.g., Redis Cloud):
```env
REDIS_HOST=your-redis-host.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password
```

### 3. Start the Worker

In a separate terminal, start the worker process:

```bash
npm run worker
```

The worker will:
- Connect to Redis
- Listen for new scan jobs
- Process scans asynchronously
- Update scan status in the database

### 4. Running in Production

For production, you'll want to run the worker as a separate process/service:

**Using PM2:**
```bash
pm2 start npm --name "scan-worker" -- run worker
pm2 save
pm2 startup
```

**Using systemd (Linux):**
Create `/etc/systemd/system/scan-worker.service`:
```ini
[Unit]
Description=PainPointRadar Scan Worker
After=network.target redis.service

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/npm run worker
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable scan-worker
sudo systemctl start scan-worker
```

**Using Docker Compose:**
```yaml
services:
  worker:
    build: .
    command: npm run worker
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis
      - db
```

## How It Works

1. **User creates a scan** → API endpoint receives request
2. **Scan job created** → Database record created with status "queued"
3. **Job enqueued** → Job added to Redis queue
4. **Worker picks up job** → Worker processes the scan:
   - Searches Reddit for posts/comments
   - Clusters pain points
   - Saves results to database
   - Updates scan status to "completed" or "failed"

## Monitoring

### Queue Statistics

Check queue status via API:
```bash
GET /api/queue/status
```

Response:
```json
{
  "stats": {
    "waiting": 5,
    "active": 2,
    "completed": 100,
    "failed": 3,
    "delayed": 0,
    "total": 110
  }
}
```

### Job Status

Check specific job status:
```bash
GET /api/queue/status?jobId=scan-abc123
```

### Worker Logs

The worker logs all activity to console:
- Job started/completed/failed
- Progress updates
- Errors

## Troubleshooting

### Worker not processing jobs

1. **Check Redis connection:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. **Check worker is running:**
   ```bash
   # Should see: "[Worker] Scan worker started and ready to process jobs"
   ```

3. **Check queue has jobs:**
   ```bash
   GET /api/queue/status
   ```

### Jobs stuck in "queued" status

- Worker might not be running
- Redis connection issue
- Worker crashed (check logs)

### Jobs failing

- Check worker logs for error messages
- Verify Reddit API credentials
- Check database connection
- Review scan job `errorMessage` field in database

## Development Tips

1. **Run worker in development:**
   ```bash
   # Terminal 1: Next.js dev server
   npm run dev

   # Terminal 2: Worker
   npm run worker
   ```

2. **Test with a scan:**
   - Create a scan via the UI
   - Watch worker logs to see processing
   - Check database for results

3. **Clear failed jobs:**
   ```typescript
   import { scanQueue } from "@/lib/queue"
   await scanQueue.clean(0, 100, "failed")
   ```

## Queue Configuration

The queue is configured in `app/lib/queue.ts`:

- **Retry attempts**: 3 attempts with exponential backoff
- **Concurrency**: 2 jobs processed simultaneously
- **Rate limiting**: Max 5 jobs per 60 seconds
- **Job retention**: 
  - Completed: 24 hours or 1000 jobs
  - Failed: 7 days

## Next Steps

- Add job prioritization (premium users get priority)
- Add job scheduling (process scans at specific times)
- Add webhook notifications (notify users when scan completes)
- Add job cancellation (allow users to cancel running scans)

