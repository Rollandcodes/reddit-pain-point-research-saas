"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, TrendingUp, MessageSquare, Target } from "lucide-react"
import Link from "next/link"

// Sample results data
const sampleResults = [
  {
    keyword: "time tracking",
    clusters: 8,
    posts: 1247,
    topPainPoint: "Manual time entry is tedious and error-prone",
    opportunity: 89,
  },
  {
    keyword: "project management",
    clusters: 12,
    posts: 2156,
    topPainPoint: "Team communication breaks down across tools",
    opportunity: 92,
  },
  {
    keyword: "invoicing",
    clusters: 6,
    posts: 892,
    topPainPoint: "Late payments are killing cash flow",
    opportunity: 87,
  },
]

export function TryItFreeWidget() {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<typeof sampleResults[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    if (!keyword.trim()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Find matching sample result or use first one
      const match = sampleResults.find(
        (r) => r.keyword.toLowerCase() === keyword.toLowerCase()
      ) || sampleResults[0]
      
      setResults(match)
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-radar-500" aria-hidden="true" />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Try It Free
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Enter a keyword to see sample pain point insights from Reddit
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              {/* Search Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="text"
                    placeholder="Try: 'time tracking', 'project management', 'invoicing'..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={!keyword.trim() || isLoading}
                  size="lg"
                >
                  {isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>

              {/* Results */}
              {results && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-radar-50 to-radar-100 border border-radar-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Keyword Analyzed</p>
                        <p className="text-lg font-semibold capitalize">{results.keyword}</p>
                      </div>
                      <Badge variant="secondary" className="bg-radar-600 text-white">
                        Sample Results
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <p className="text-xs text-muted-foreground">Posts Found</p>
                        </div>
                        <p className="text-2xl font-bold">{results.posts.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <p className="text-xs text-muted-foreground">Pain Points</p>
                        </div>
                        <p className="text-2xl font-bold">{results.clusters}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-background border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground">Top Pain Point</p>
                        <Badge className="bg-radar-100 text-radar-700">
                          <Target className="h-3 w-3 mr-1" aria-hidden="true" />
                          {results.opportunity} Opportunity
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">&quot;{results.topPainPoint}&quot;</p>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Get full access to all pain points, sentiment analysis, and CSV exports
                    </p>
                    <Link href="/sign-up">
                      <Button size="lg" className="w-full sm:w-auto">
                        Sign Up for Free
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!results && !isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter a keyword above to see sample insights
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: time tracking, project management, invoicing
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

