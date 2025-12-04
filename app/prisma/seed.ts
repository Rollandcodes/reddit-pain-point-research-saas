import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  // await prisma.clusterExample.deleteMany({})
  // await prisma.cluster.deleteMany({})
  // await prisma.scanJob.deleteMany({})
  // await prisma.user.deleteMany({})

  // Create test users
  console.log('📝 Creating test users...')

  const adminUser = await prisma.user.upsert({
    where: { clerkId: 'clerk_admin_001' },
    update: {},
    create: {
      clerkId: 'clerk_admin_001',
      email: 'admin@painpointradar.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      lastActive: new Date(),
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  const testUser1 = await prisma.user.upsert({
    where: { clerkId: 'clerk_user_001' },
    update: {},
    create: {
      clerkId: 'clerk_user_001',
      email: 'user1@example.com',
      name: 'John Doe',
      role: 'user',
      status: 'active',
      lastActive: new Date(),
    },
  })
  console.log('✅ Test user 1 created:', testUser1.email)

  const testUser2 = await prisma.user.upsert({
    where: { clerkId: 'clerk_user_002' },
    update: {},
    create: {
      clerkId: 'clerk_user_002',
      email: 'user2@example.com',
      name: 'Jane Smith',
      role: 'user',
      status: 'active',
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  })
  console.log('✅ Test user 2 created:', testUser2.email)

  const suspendedUser = await prisma.user.upsert({
    where: { clerkId: 'clerk_user_003' },
    update: {},
    create: {
      clerkId: 'clerk_user_003',
      email: 'suspended@example.com',
      name: 'Suspended User',
      role: 'user',
      status: 'suspended',
      lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
  })
  console.log('✅ Suspended user created:', suspendedUser.email)

  // Create test scans
  console.log('📊 Creating test scans...')

  const completedScan = await prisma.scanJob.upsert({
    where: { id: 'scan_001' },
    update: {},
    create: {
      id: 'scan_001',
      userId: testUser1.id,
      keywords: 'remote work, flexibility, work-life balance',
      subreddits: 'r/jobs,r/personalfinance,r/remotework',
      timeRange: '30',
      status: 'completed',
      totalPostsAnalyzed: 1245,
      totalClusters: 8,
      duration: 245, // 4 minutes 5 seconds
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  })
  console.log('✅ Completed scan created:', completedScan.id)

  const failedScan = await prisma.scanJob.upsert({
    where: { id: 'scan_002' },
    update: {},
    create: {
      id: 'scan_002',
      userId: testUser1.id,
      keywords: 'customer support, automation',
      subreddits: 'r/startup,r/entrepreneur',
      timeRange: '7',
      status: 'failed',
      totalPostsAnalyzed: 45,
      totalClusters: 0,
      duration: 89,
      errorMessage: 'Failed to fetch posts from subreddit r/startup',
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  })
  console.log('✅ Failed scan created:', failedScan.id)

  const runningScan = await prisma.scanJob.upsert({
    where: { id: 'scan_003' },
    update: {},
    create: {
      id: 'scan_003',
      userId: testUser2.id,
      keywords: 'AI, machine learning, development',
      subreddits: 'r/MachineLearning,r/learnprogramming,r/artificial',
      timeRange: '90',
      status: 'running',
      totalPostsAnalyzed: 523,
      totalClusters: 0,
    },
  })
  console.log('✅ Running scan created:', runningScan.id)

  const queuedScan = await prisma.scanJob.upsert({
    where: { id: 'scan_004' },
    update: {},
    create: {
      id: 'scan_004',
      userId: testUser2.id,
      keywords: 'ecommerce, dropshipping',
      subreddits: 'r/ecommerce,r/Shopify,r/dropshipping',
      timeRange: '30',
      status: 'queued',
      totalPostsAnalyzed: 0,
      totalClusters: 0,
    },
  })
  console.log('✅ Queued scan created:', queuedScan.id)

  const cancelledScan = await prisma.scanJob.upsert({
    where: { id: 'scan_005' },
    update: {},
    create: {
      id: 'scan_005',
      userId: testUser1.id,
      keywords: 'saas pricing, subscriptions',
      subreddits: 'r/SaaS,r/startups',
      timeRange: '30',
      status: 'cancelled',
      totalPostsAnalyzed: 234,
      totalClusters: 3,
      duration: 156,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  })
  console.log('✅ Cancelled scan created:', cancelledScan.id)

  // Create test clusters for the completed scan
  console.log('🎯 Creating test clusters...')

  const cluster1 = await prisma.cluster.upsert({
    where: { id: 'cluster_001' },
    update: {},
    create: {
      id: 'cluster_001',
      scanJobId: completedScan.id,
      name: 'Flexible Schedule Benefits',
      description: 'Users express desire for flexible working hours and the ability to work from anywhere',
      postCount: 234,
      averageSentiment: 0.78,
      opportunityScore: 92,
    },
  })
  console.log('✅ Cluster 1 created:', cluster1.name)

  const cluster2 = await prisma.cluster.upsert({
    where: { id: 'cluster_002' },
    update: {},
    create: {
      id: 'cluster_002',
      scanJobId: completedScan.id,
      name: 'Work-Life Balance Challenges',
      description: 'Posts discussing burnout, overworking, and lack of boundaries between work and personal time',
      postCount: 189,
      averageSentiment: -0.45,
      opportunityScore: 85,
    },
  })
  console.log('✅ Cluster 2 created:', cluster2.name)

  // Create example quotes for clusters
  console.log('💬 Creating cluster examples...')

  await prisma.clusterExample.upsert({
    where: { id: 'example_001' },
    update: {},
    create: {
      id: 'example_001',
      clusterId: cluster1.id,
      sourceUrl: 'https://reddit.com/r/jobs/comments/example1',
      quoteText:
        'I love my job but the flexibility to work from home is a huge factor in my productivity and happiness',
      sentiment: 0.85,
    },
  })
  console.log('✅ Example 1 created')

  await prisma.clusterExample.upsert({
    where: { id: 'example_002' },
    update: {},
    create: {
      id: 'example_002',
      clusterId: cluster2.id,
      sourceUrl: 'https://reddit.com/r/personalfinance/comments/example2',
      quoteText: "I'm working 60+ hours a week and it's destroying my mental health. Nobody should have to sacrifice their well-being for a job.",
      sentiment: -0.9,
    },
  })
  console.log('✅ Example 2 created')

  console.log('\n✨ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log('  • Users created: 4 (1 admin, 3 regular)')
  console.log('  • Scans created: 5 (completed, failed, running, queued, cancelled)')
  console.log('  • Clusters created: 2')
  console.log('  • Cluster examples created: 2')
  console.log('\n🎯 Test the admin dashboard at http://localhost:3000/admin')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
