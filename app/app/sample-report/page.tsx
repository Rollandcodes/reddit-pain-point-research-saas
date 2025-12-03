import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, TrendingUp, MessageSquare, BarChart3, ExternalLink, Copy, AlertCircle } from "lucide-react"
import Link from "next/link"

// Demo data for sample report
const SAMPLE_DATA = {
  keywords: "project management SaaS",
  subreddits: "SaaS, Entrepreneur, productivity",
  timeRange: "30",
  totalPostsAnalyzed: 1247,
  totalClusters: 12,
  avgOpportunity: 68,
  clusters: [
    {
      id: "1",
      name: "Collaboration & Team Communication",
      description: "Users struggle with fragmented communication across multiple tools. They want everything in one place.",
      postCount: 156,
      averageSentiment: -0.4,
      opportunityScore: 92,
      examples: [
        {
          id: "1a",
          quoteText: "I'm so tired of switching between Slack, Trello, and email just to stay on top of one project. There has to be a better way.",
          sourceUrl: "https://reddit.com/r/SaaS/comments/example1",
        },
        {
          id: "1b",
          quoteText: "Our team wastes at least an hour a day just trying to find information scattered across different apps.",
          sourceUrl: "https://reddit.com/r/Entrepreneur/comments/example2",
        },
      ],
    },
    {
      id: "2",
      name: "Pricing & Value Confusion",
      description: "Users find pricing tiers confusing and feel nickel-and-dimed for basic features.",
      postCount: 134,
      averageSentiment: -0.6,
      opportunityScore: 87,
      examples: [
        {
          id: "2a",
          quoteText: "Why do I need to pay $25/user/month just to get a Gantt chart? This is a basic feature!",
          sourceUrl: "https://reddit.com/r/SaaS/comments/example3",
        },
        {
          id: "2b",
          quoteText: "The free tier is basically useless. 3 projects? I need at least 10 for my freelance work.",
          sourceUrl: "https://reddit.com/r/productivity/comments/example4",
        },
      ],
    },
    {
      id: "3",
      name: "Mobile App Quality",
      description: "Mobile apps are often buggy, slow, or missing critical features compared to desktop.",
      postCount: 98,
      averageSentiment: -0.5,
      opportunityScore: 79,
      examples: [
        {
          id: "3a",
          quoteText: "The mobile app crashes every time I try to attach a file. It's been like this for months.",
          sourceUrl: "https://reddit.com/r/SaaS/comments/example5",
        },
        {
          id: "3b",
          quoteText: "I can't edit tasks on mobile, only view them. What's the point then?",
          sourceUrl: "https://reddit.com/r/Entrepreneur/comments/example6",
        },
      ],
    },
    {
      id: "4",
      name: "Onboarding & Learning Curve",
      description: "New users feel overwhelmed by complex interfaces and lack of guided setup.",
      postCount: 87,
      averageSentiment: -0.3,
      opportunityScore: 71,
      examples: [
        {
          id: "4a",
          quoteText: "Spent 3 hours trying to set up a simple workflow. The documentation is terrible.",
          sourceUrl: "https://reddit.com/r/productivity/comments/example7",
        },
      ],
    },
    {
      id: "5",
      name: "Integration Limitations",
      description: "Users need integrations with tools they already use, but options are limited or expensive.",
      postCount: 76,
      averageSentiment: -0.4,
      opportunityScore: 65,
      examples: [
        {
          id: "5a",
          quoteText: "No Notion integration? In 2024? I guess I'm stuck copying things manually.",
          sourceUrl: "https://reddit.com/r/SaaS/comments/example8",
        },
      ],
    },
  ],
}

function opportunityColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50"
  if (score >= 60) return "text-yellow-600 bg-yellow-50"
  if (score >= 40) return "text-orange-600 bg-orange-50"
  return "text-gray-600 bg-gray-50"
}

function sentimentLabel(score: number): "negative" | "neutral" | "positive" {
  if (score < -0.2) return "negative"
  if (score > 0.2) return "positive"
  return "neutral"
}

export default function SampleReportPage() {
  const data = SAMPLE_DATA
  const topClusters = data.clusters.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Demo Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">This is a sample report with demo data</p>
              <p className="text-sm text-yellow-700">
                Sign up to create your own scans and discover real pain points from Reddit.{" "}
                <Link href="/#waitlist" className="underline font-medium">Join the waitlist →</Link>
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold">{data.keywords}</h1>
              <p className="text-muted-foreground">
                r/{data.subreddits.replace(/,/g, ", r/")} • Last {data.timeRange} days • Sample Data
              </p>
            </div>
            <Button variant="outline" disabled>
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
                    <p className="text-2xl font-bold">{data.totalPostsAnalyzed.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold">{data.totalClusters}</p>
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
                    <p className="text-2xl font-bold">{data.avgOpportunity}</p>
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
                        sentimentLabel(cluster.averageSentiment) === "negative"
                          ? "text-red-600"
                          : sentimentLabel(cluster.averageSentiment) === "positive"
                          ? "text-green-600"
                          : ""
                      }>
                        {sentimentLabel(cluster.averageSentiment)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Clusters */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Pain Point Clusters</h2>
            <div className="space-y-4">
              {data.clusters.map((cluster) => (
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
                        <Badge
                          variant={
                            sentimentLabel(cluster.averageSentiment) === "negative"
                              ? "danger"
                              : sentimentLabel(cluster.averageSentiment) === "positive"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {sentimentLabel(cluster.averageSentiment)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {cluster.postCount} related discussions found
                    </p>

                    {cluster.examples.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Example quotes:</h4>
                        {cluster.examples.map((example) => (
                          <div key={example.id} className="bg-muted/50 rounded-lg p-4 relative group">
                            <p className="text-sm italic">&quot;{example.quoteText}&quot;</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground inline-flex items-center">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Source hidden in demo
                              </span>
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

          {/* CTA */}
          <Card className="bg-radar-50 border-radar-200">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to find your own pain points?</h3>
              <p className="text-muted-foreground mb-6">
                Join the waitlist and get 3 free scans when we launch
              </p>
              <Link href="/#waitlist">
                <Button size="lg">Join Waitlist</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
