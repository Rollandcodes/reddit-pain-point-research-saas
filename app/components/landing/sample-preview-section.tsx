"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, MessageSquare, Target } from "lucide-react"
import Link from "next/link"

const sampleClusters = [
  {
    rank: 1,
    name: "Time tracking frustrations",
    posts: 234,
    sentiment: -0.7,
    opportunity: 92,
    quote: "I've tried every time tracker and they all suck for freelancers...",
  },
  {
    rank: 2,
    name: "Invoice payment delays",
    posts: 189,
    sentiment: -0.8,
    opportunity: 88,
    quote: "Clients always pay late and I have no way to automate reminders...",
  },
  {
    rank: 3,
    name: "Project scope creep",
    posts: 156,
    sentiment: -0.6,
    opportunity: 85,
    quote: "Every project ends up 2x the original scope with no extra pay...",
  },
]

export function SamplePreviewSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            See What You&apos;ll Get
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Here&apos;s a real sample from scanning &quot;freelancer problems&quot; on Reddit
          </p>
        </div>

        {/* Mock Report Preview */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-radar-600 to-radar-500 p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-radar-100 text-sm">Pain Point Report</p>
                  <h3 className="text-xl sm:text-2xl font-bold">Freelancer Problems</h3>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-radar-100">Posts Analyzed</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <div>
                    <p className="text-radar-100">Clusters Found</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Clusters */}
            <div className="p-4 sm:p-6 space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Top Pain Points by Opportunity Score
              </h4>
              
              {sampleClusters.map((cluster) => (
                <div 
                  key={cluster.rank}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-radar-100 flex items-center justify-center text-radar-700 font-bold text-sm">
                      {cluster.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold truncate">{cluster.name}</h5>
                      <p className="text-sm text-muted-foreground italic truncate">
                        &quot;{cluster.quote}&quot;
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span>{cluster.posts}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-red-500" aria-hidden="true" />
                      <span className="text-red-600">{(cluster.sentiment * 100).toFixed(0)}%</span>
                    </div>
                    <Badge variant="secondary" className="bg-radar-100 text-radar-700">
                      <Target className="h-3 w-3 mr-1" aria-hidden="true" />
                      {cluster.opportunity}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Blurred preview hint */}
              <div className="relative">
                <div className="p-4 rounded-lg border bg-muted/30 blur-sm">
                  <div className="h-16 bg-muted rounded"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge variant="outline" className="bg-background">
                    +9 more clusters
                  </Badge>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t p-4 sm:p-6 bg-muted/30 text-center">
              <Link href="/sample-report">
                <Button size="lg">
                  View Full Sample Report
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
