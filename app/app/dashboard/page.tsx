import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getScans(userId: string) {
  return prisma.scanJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      clusters: {
        select: { id: true, name: true, opportunityScore: true },
        orderBy: { opportunityScore: "desc" },
        take: 3,
      },
    },
  })
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>
    case "running":
      return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running</Badge>
    case "failed":
      return <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>
    default:
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Queued</Badge>
  }
}

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const scans = await getScans(userId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your pain point scans</p>
        </div>
        <Link href="/dashboard/new-scan">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Scans List */}
      {scans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first scan to discover pain points from Reddit
            </p>
            <Link href="/dashboard/new-scan">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Scan
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scans.map((scan) => (
            <Link key={scan.id} href={`/dashboard/scans/${scan.id}`}>
              <Card className="hover:border-radar-200 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{scan.keywords}</CardTitle>
                      <CardDescription>
                        {scan.subreddits ? `r/${scan.subreddits.replace(/,/g, ", r/")}` : "All subreddits"} 
                        {" • "} Last {scan.timeRange} days
                      </CardDescription>
                    </div>
                    <StatusBadge status={scan.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{scan.totalPostsAnalyzed} posts analyzed</span>
                      <span>{scan.totalClusters} clusters found</span>
                    </div>
                    <span className="text-muted-foreground">{formatDate(scan.createdAt)}</span>
                  </div>
                  
                  {scan.clusters.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {scan.clusters.map((cluster) => (
                        <Badge key={cluster.id} variant="outline">
                          {cluster.name} ({cluster.opportunityScore})
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
