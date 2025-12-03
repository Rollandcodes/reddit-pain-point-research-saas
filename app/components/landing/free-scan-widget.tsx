"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, MessageSquare, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// Sample pain point data
const samplePainPoints = [
  {
    keyword: "project management",
    painPoints: [
      {
        title: "Team communication breaks down across tools",
        severity: 87,
        quote: "We're using Slack, Jira, Trello, and email. Nothing syncs and I'm constantly switching between apps to find what I need.",
        mentions: 234,
      },
      {
        title: "Scope creep without budget adjustments",
        severity: 82,
        quote: "Every project starts with clear requirements, then clients add 'just one more thing' without increasing the budget or timeline.",
        mentions: 189,
      },
      {
        title: "No visibility into team workload",
        severity: 75,
        quote: "I have no idea who's overloaded and who has capacity. We end up burning out our best people.",
        mentions: 156,
      },
      {
        title: "Time tracking is manual and inaccurate",
        severity: 71,
        quote: "I forget to start timers, forget to stop them, and spend more time tracking time than doing actual work.",
        mentions: 142,
      },
      {
        title: "Client feedback scattered across channels",
        severity: 68,
        quote: "Feedback comes via email, Slack, phone calls, and in-person meetings. I lose track of what's been addressed.",
        mentions: 128,
      },
    ],
  },
  {
    keyword: "time tracking",
    painPoints: [
      {
        title: "Manual time entry is tedious and error-prone",
        severity: 91,
        quote: "I spend 30 minutes every Friday trying to remember what I did all week. Half the time I'm just guessing.",
        mentions: 312,
      },
      {
        title: "No integration with actual work tools",
        severity: 84,
        quote: "The time tracker doesn't connect to my IDE, design tools, or project management. It's completely separate from my workflow.",
        mentions: 267,
      },
      {
        title: "Invoicing requires manual calculations",
        severity: 79,
        quote: "I have to export time data, calculate rates, add expenses, and format invoices manually. Takes hours every month.",
        mentions: 198,
      },
      {
        title: "Team members forget to track time",
        severity: 73,
        quote: "I constantly have to remind my team to log their hours. By the time they do it, the data is inaccurate.",
        mentions: 175,
      },
    ],
  },
  {
    keyword: "invoicing",
    painPoints: [
      {
        title: "Late payments are killing cash flow",
        severity: 89,
        quote: "Clients consistently pay 2-3 weeks late. I'm constantly following up and it's affecting my ability to pay my own bills.",
        mentions: 298,
      },
      {
        title: "Creating invoices takes too long",
        severity: 76,
        quote: "I have to manually enter line items, calculate taxes, format everything, and send follow-ups. There's got to be a better way.",
        mentions: 201,
      },
      {
        title: "No automated payment reminders",
        severity: 72,
        quote: "I have to manually check which invoices are overdue and send reminder emails. It's embarrassing and time-consuming.",
        mentions: 167,
      },
    ],
  },
]

// Default sample data for any other keyword
const defaultPainPoints = [
  {
    title: "Lack of integration between tools",
    severity: 85,
    quote: "I'm constantly switching between different apps and nothing talks to each other. It's frustrating and wastes so much time.",
    mentions: 245,
  },
  {
    title: "Poor user experience in existing solutions",
    severity: 78,
    quote: "The current tools are clunky and outdated. They work but they're not enjoyable to use, which makes me avoid them.",
    mentions: 198,
  },
  {
    title: "High cost for limited features",
    severity: 74,
    quote: "I'm paying $50/month for a tool that only does half of what I need. The pricing doesn't match the value.",
    mentions: 176,
  },
  {
    title: "Lack of customization options",
    severity: 69,
    quote: "Every tool forces me to work their way. I wish I could customize workflows to match how my team actually works.",
    mentions: 154,
  },
]

export function FreeScanWidget() {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<typeof samplePainPoints[0]["painPoints"] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)

  const handleScan = () => {
    if (!keyword.trim()) return

    setIsLoading(true)
    setHasScanned(false)

    // Simulate API call
    setTimeout(() => {
      // Find matching sample data or use default
      const keywordLower = keyword.toLowerCase().trim()
      const match = samplePainPoints.find(
        (data) => data.keyword.toLowerCase() === keywordLower
      )

      setResults(match ? match.painPoints : defaultPainPoints)
      setIsLoading(false)
      setHasScanned(true)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleScan()
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-radar-500" aria-hidden="true" />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Try PainPointRadar Free
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Scan Reddit for validated pain points in seconds
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              {/* Search Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="text"
                    placeholder="Enter keyword (e.g., project management)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handleScan} 
                  disabled={!keyword.trim() || isLoading}
                  size="lg"
                  className="whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Scanning...
                    </>
                  ) : (
                    "Scan Reddit Now"
                  )}
                </Button>
              </div>

              {/* Results */}
              {results && hasScanned && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Scan Results for</p>
                      <p className="text-lg font-semibold capitalize">{keyword}</p>
                    </div>
                    <Badge variant="secondary" className="bg-radar-100 text-radar-700">
                      {results.length} Pain Points Found
                    </Badge>
                  </div>

                  {/* Pain Points List */}
                  <div className="space-y-3">
                    {results.map((painPoint, index) => (
                      <Card 
                        key={index} 
                        className="border-2 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Left: Title and Quote */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-radar-100 flex items-center justify-center text-radar-700 font-bold text-sm flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-base mb-2">
                                    {painPoint.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                                    &quot;{painPoint.quote}&quot;
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right: Metrics */}
                            <div className="flex sm:flex-col gap-3 sm:gap-2 sm:items-end">
                              {/* Severity Score */}
                              <div className="flex flex-col items-center sm:items-end">
                                <div className="flex items-center gap-1 mb-1">
                                  <TrendingUp className="h-4 w-4 text-red-500" aria-hidden="true" />
                                  <span className="text-xs font-medium text-muted-foreground">Severity</span>
                                </div>
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                  {painPoint.severity}
                                </Badge>
                              </div>

                              {/* Mentions */}
                              <div className="flex flex-col items-center sm:items-end">
                                <div className="flex items-center gap-1 mb-1">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                  <span className="text-xs font-medium text-muted-foreground">Mentions</span>
                                </div>
                                <span className="text-sm font-semibold">
                                  {painPoint.mentions}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-6 pt-6 border-t bg-gradient-to-r from-radar-50 to-transparent rounded-lg p-6 text-center">
                    <p className="text-sm font-medium mb-2">
                      See full report with 20+ pain points, sentiment analysis, and CSV export
                    </p>
                    <Link href="#waitlist">
                      <Button size="lg" className="w-full sm:w-auto">
                        Join Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!results && !isLoading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-radar-100 mb-4">
                    <Search className="h-8 w-8 text-radar-600" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium mb-2">Ready to discover pain points?</p>
                  <p className="text-xs text-muted-foreground">
                    Try: project management, time tracking, invoicing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

