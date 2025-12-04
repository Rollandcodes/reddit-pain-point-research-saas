import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, TrendingUp, MessageSquare, BarChart3, ExternalLink, Copy } from "lucide-react"
import { formatDate, formatNumber, sentimentLabel, opportunityColor } from "@/lib/utils"

async function getScan(id: string, userId: string) {
  const scan = await prisma.scanJob.findUnique({
    where: { id },
    include: {
      clusters: {
        include: { examples: true },
        orderBy: { opportunityScore: "desc" },
      },
    },
  })

  if (!scan || scan.userId !== userId) {
    return null
  }

  return scan
}

export default async function ScanResultPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const scan = await getScan(params.id, userId)

  if (!scan) {
    notFound()
  }

  const topClusters = scan.clusters.slice(0, 3)
  const avgOpportunity = scan.clusters.length > 0
    ? Math.round(scan.clusters.reduce((sum, c) => sum + c.opportunityScore, 0) / scan.clusters.length)
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{scan.keywords}</h1>
          <p className="text-muted-foreground">
            {scan.subreddits ? `r/${scan.subreddits.replace(/,/g, ", r/")}` : "All subreddits"} 
            {" • "} Last {scan.timeRange} days
            {" • "} {formatDate(scan.createdAt)}
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-radar-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-radar-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(scan.totalPostsAnalyzed)}</p>
                <p className="text-sm text-muted-foreground">Posts Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scan.totalClusters}</p>
                <p className="text-sm text-muted-foreground">Pain Point Clusters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgOpportunity}</p>
                <p className="text-sm text-muted-foreground">Avg Opportunity Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{topClusters[0]?.opportunityScore || 0}</p>
                <p className="text-sm text-muted-foreground">Top Opportunity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clusters */}
      {topClusters.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topClusters.map((cluster, index) => (
              <Card key={cluster.id} className="border-2 hover:border-radar-200 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={opportunityColor(cluster.opportunityScore)}>
                      Score: {cluster.opportunityScore}
                    </Badge>
                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                  </div>
                  <CardTitle className="text-lg">{cluster.name}</CardTitle>
                  <CardDescription>{cluster.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{cluster.postCount} mentions</span>
                    <span>•</span>
                    <span className={
                      sentimentLabel(cluster.averageSentiment) === 'negative' 
                        ? 'text-red-600' 
                        : sentimentLabel(cluster.averageSentiment) === 'positive'
                        ? 'text-green-600'
                        : ''
                    }>
                      {sentimentLabel(cluster.averageSentiment)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Clusters */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Pain Point Clusters</h2>
        <div className="space-y-4">
          {scan.clusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cluster.name}</CardTitle>
                    <CardDescription>{cluster.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={opportunityColor(cluster.opportunityScore)}>
                      Opportunity: {cluster.opportunityScore}
                    </Badge>
                    <Badge variant={
                      sentimentLabel(cluster.averageSentiment) === 'negative' 
                        ? 'danger' 
                        : sentimentLabel(cluster.averageSentiment) === 'positive'
                        ? 'success'
                        : 'secondary'
                    }>
                      {sentimentLabel(cluster.averageSentiment)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {cluster.postCount} related discussions found
                </p>
                
                {/* Example Quotes */}
                {cluster.examples.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Example quotes:</h4>
                    {cluster.examples.slice(0, 3).map((example) => (
                      <div key={example.id} className="bg-muted/50 rounded-lg p-4 relative group">
                        <p className="text-sm italic">&quot;{example.quoteText}&quot;</p>
                        <div className="flex items-center gap-2 mt-2">
                          {example.sourceUrl && (
                            <a 
                              href={example.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-radar-600 hover:underline inline-flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View source
                            </a>
                          )}
                          <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
