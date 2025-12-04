# Admin Dashboard Implementation Guide

## Overview

The admin dashboard provides comprehensive management capabilities for users, scans, and analytics with a clean, intuitive interface. This guide covers features, architecture, and Prisma integration steps.

## Features

### 1. Dashboard Overview
- **Location:** `/admin`
- **Components:** Stats cards, recent activity feed
- **Metrics Displayed:**
  - Total Users
  - Total Scans
  - Active Users
  - Average Response Time

### 2. User Management
- **Location:** `/admin/users`
- **Features:**
  - Sortable table with name, email, status, scans count, joined date, last active
  - Filter by status (active, inactive, suspended) and join date
  - Search by name or email
  - Pagination (10 items per page)
  - **Actions:**
    - Suspend/Unsuspend user
    - Promote user to admin
    - Delete user

### 3. Scan Management
- **Location:** `/admin/scans`
- **Features:**
  - Stats cards showing total, completed, running, failed counts
  - Sortable table with subreddit, user, status, pain points, solutions, duration, completion time
  - Filter by status, date, and subreddit
  - Search by subreddit or username
  - **Actions:**
    - Retry failed/queued scans
    - Cancel running scans
    - Delete scans

### 4. Analytics
- **Location:** `/admin/analytics`
- **Features:**
  - Key metrics (total users, total scans, success rate, avg duration)
  - Scans over time chart
  - Top subreddits analysis
  - User retention metrics
  - Pain points summary

## Architecture

### Directory Structure

```
app/app/admin/
├── components/
│   ├── admin-layout.tsx       # Main layout with sidebar navigation
│   ├── action-menu.tsx        # Dropdown menu for row actions
│   ├── data-table.tsx         # Generic table component
│   ├── filters.tsx            # Filter UI component
│   ├── stats-card.tsx         # Stats display card
│   ├── badge.tsx              # Status badge component
│   └── index.ts               # Barrel exports
├── page.tsx                   # Dashboard main page
├── users/
│   └── page.tsx               # Users management page
├── scans/
│   └── page.tsx               # Scans management page
└── analytics/
    └── page.tsx               # Analytics dashboard page

app/app/api/admin/
├── stats/
│   └── route.ts               # GET dashboard statistics
├── users/
│   ├── route.ts               # GET paginated user list
│   └── [userId]/
│       └── action/
│           └── route.ts       # POST user actions (suspend, promote, delete)
├── scans/
│   ├── route.ts               # GET paginated scan list
│   └── [scanId]/
│       └── action/
│           └── route.ts       # POST scan actions (retry, cancel, delete)
└── analytics/
    └── route.ts               # GET analytics data

app/lib/
└── admin.ts                   # Admin auth utilities
```

### Component Architecture

#### AdminLayout
- Top-level wrapper for admin pages
- Provides sidebar navigation with Clerk auth check
- Mobile-responsive hamburger menu
- Sign-out button

#### DataTable
- Generic `<T>` for type safety
- Features:
  - Search across all columns
  - Click header to sort (asc/desc)
  - Pagination with page buttons
  - Custom render functions per column
  - Responsive design

#### Filters
- Supports multiple filter types: select, date, text
- Shows active filter count
- Clear all filters button
- Callback integration with parent component

#### ActionMenu
- Dropdown menu with Lucide icons
- Supports variant styling (default, warning, danger)
- Async action handling with loading state
- Click-outside detection to close menu

## Prisma Integration

### Current State
- All pages use mock data
- API routes have TODO comments for Prisma integration
- Ready for database queries

### Integration Steps

#### 1. Update Admin Library (`app/lib/admin.ts`)

Replace email-based admin check with database lookup:

```typescript
// OLD: Email-based check
const adminEmails = ['admin@example.com']
export const checkAdminAccess = async () => {
  const { userId } = await auth()
  // ...
  const authorized = adminEmails.includes(user?.primaryEmailAddress?.emailAddress || '')
}

// NEW: Database-based check
import { prisma } from './db'

export const checkAdminAccess = async () => {
  const { userId } = await auth()
  if (!userId) return { authorized: false }
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  })
  
  return { authorized: user?.role === 'admin' }
}
```

#### 2. Update Dashboard Stats (`app/app/api/admin/stats/route.ts`)

```typescript
import { prisma } from '@/lib/db'
import { checkAdminAccess } from '@/lib/admin'

export async function GET() {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    totalUsers,
    totalScans,
    activeUsers,
    completedScans,
    failedScans,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.scan.count(),
    prisma.user.count({ where: { lastActive: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.scan.count({ where: { status: 'completed' } }),
    prisma.scan.count({ where: { status: 'failed' } }),
  ])

  const avgResponseTime = await prisma.scan.aggregate({
    _avg: { duration: true },
    where: { status: 'completed' },
  })

  const successRate = totalScans > 0 
    ? Math.round((completedScans / totalScans) * 100) 
    : 0

  return NextResponse.json({
    totalUsers,
    totalScans,
    activeUsers,
    avgResponseTime: Math.round(avgResponseTime._avg.duration || 0),
    successRate,
  })
}
```

#### 3. Update User List Endpoint (`app/app/api/admin/users/route.ts`)

```typescript
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''

  const users = await prisma.user.findMany({
    where: search 
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      _count: { select: { scans: true } },
      createdAt: true,
      lastActive: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.user.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
  })

  return NextResponse.json({
    users: users.map(u => ({
      ...u,
      scans: u._count.scans,
      joinedDate: u.createdAt.toISOString(),
      lastActive: u.lastActive?.toISOString() || u.createdAt.toISOString(),
    })),
    total,
    page,
    limit,
  })
}
```

#### 4. Update Scan List Endpoint (`app/app/api/admin/scans/route.ts`)

```typescript
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const status = searchParams.get('status')

  const scans = await prisma.scan.findMany({
    where: status ? { status } : {},
    skip: (page - 1) * limit,
    take: limit,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.scan.count({
    where: status ? { status } : {},
  })

  return NextResponse.json({
    scans: scans.map(s => ({
      id: s.id,
      subreddit: s.subreddit,
      username: s.user.name,
      status: s.status,
      painPoints: s.results?.painPoints?.length || 0,
      solutions: s.results?.solutions?.length || 0,
      duration: s.duration || 0,
      completedAt: s.completedAt?.toISOString() || new Date().toISOString(),
    })),
    total,
    page,
    limit,
  })
}
```

#### 5. Update User Actions Endpoint (`app/app/api/admin/users/[userId]/action/route.ts`)

```typescript
import { prisma } from '@/lib/db'

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await request.json()

  switch (action) {
    case 'suspend':
      await prisma.user.update({
        where: { id: params.userId },
        data: { status: 'suspended' },
      })
      break
    case 'unsuspend':
      await prisma.user.update({
        where: { id: params.userId },
        data: { status: 'active' },
      })
      break
    case 'delete':
      await prisma.user.delete({
        where: { id: params.userId },
      })
      break
    case 'promote':
      await prisma.user.update({
        where: { id: params.userId },
        data: { role: 'admin' },
      })
      break
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true, action, userId: params.userId })
}
```

#### 6. Update Scan Actions Endpoint (`app/app/api/admin/scans/[scanId]/action/route.ts`)

```typescript
import { prisma } from '@/lib/db'
import { queueScan } from '@/lib/queue' // or your queue system

export async function POST(request: Request, { params }: { params: { scanId: string } }) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await request.json()

  switch (action) {
    case 'retry':
      const scan = await prisma.scan.findUnique({
        where: { id: params.scanId },
      })
      if (!scan) {
        return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
      }
      // Re-queue for processing
      await queueScan(scan)
      await prisma.scan.update({
        where: { id: params.scanId },
        data: { status: 'queued' },
      })
      break
    case 'cancel':
      await prisma.scan.update({
        where: { id: params.scanId },
        data: { status: 'cancelled' },
      })
      break
    case 'delete':
      await prisma.scan.delete({
        where: { id: params.scanId },
      })
      break
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true, action, scanId: params.scanId })
}
```

#### 7. Update Analytics Endpoint (`app/app/api/admin/analytics/route.ts`)

```typescript
import { prisma } from '@/lib/db'

export async function GET() {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Scans over time (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const scansOverTime = await prisma.scan.groupBy({
    by: ['createdAt'],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: true,
    orderBy: { createdAt: 'asc' },
  })

  // Top subreddits
  const topSubreddits = await prisma.scan.groupBy({
    by: ['subreddit'],
    _count: true,
    orderBy: { _count: { true: 'desc' } },
    take: 5,
  })

  // User metrics
  const newUsersThisMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  })

  const painPointsSummary = await prisma.scan.findMany({
    where: { status: 'completed' },
    select: { results: true },
  })

  return NextResponse.json({
    scansOverTime: scansOverTime.map(s => ({
      date: s.createdAt.toISOString().split('T')[0],
      count: s._count,
    })),
    topSubreddits: topSubreddits.map(s => ({
      name: s.subreddit,
      scans: s._count,
    })),
    userMetrics: {
      avgScansPerUser: await calculateAvgScansPerUser(),
      retentionRate: await calculateRetentionRate(),
      newUsersThisMonth,
      churnRate: await calculateChurnRate(),
    },
    painPointsSummary: aggregatePainPoints(painPointsSummary),
  })
}
```

### Prisma Schema Requirements

Ensure your `prisma/schema.prisma` includes these fields:

```prisma
model User {
  // ... existing fields
  role          String    @default("user")   // "user" or "admin"
  status        String    @default("active") // "active", "inactive", "suspended"
  lastActive    DateTime?
  scans         Scan[]
}

model Scan {
  // ... existing fields
  status        String    @default("queued") // "queued", "running", "completed", "failed", "cancelled"
  duration      Int?      // seconds
  results       Json?     // pain points, solutions, etc.
  user          User      @relation(fields: [userId], references: [id])
  userId        String
}
```

## Security Considerations

1. **Authentication:** All admin endpoints require Clerk authentication
2. **Authorization:** Verify admin role in `checkAdminAccess()` middleware
3. **RBAC:** Implement role-based access control in Prisma schema
4. **Audit Logging:** Consider adding audit logs for all admin actions
5. **Rate Limiting:** Add rate limiting to admin API endpoints

## Testing

### Manual Testing Checklist
- [ ] Admin pages load correctly
- [ ] Filters work (status, date, search)
- [ ] Sorting works (clicking column headers)
- [ ] Pagination works (page buttons)
- [ ] Action menu appears on row hover
- [ ] User actions execute successfully
- [ ] Scan actions execute successfully
- [ ] API endpoints return correct status codes

### API Testing
```bash
# Test admin stats endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/stats

# Test user list endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users?page=1&limit=10

# Test user action endpoint
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"suspend"}' \
  http://localhost:3000/api/admin/users/USER_ID/action
```

## Performance Optimization

1. **Pagination:** Implement cursor-based pagination for large datasets
2. **Caching:** Use Redis for frequently accessed analytics data
3. **Indexes:** Add database indexes on `status`, `createdAt`, `userId` fields
4. **Virtual Scrolling:** For tables with 1000+ rows, implement virtual scrolling
5. **API Response Compression:** Enable gzip in Next.js

## Future Enhancements

- [ ] User detail/edit pages
- [ ] Scan result viewer with detailed analysis
- [ ] Export data (CSV, PDF)
- [ ] Real-time notifications for admin actions
- [ ] Audit log viewer
- [ ] Admin activity dashboard
- [ ] Scheduled reports
- [ ] Bulk actions (suspend multiple users, retry multiple scans)
- [ ] API key management for external integrations
- [ ] Settings page for system configuration
