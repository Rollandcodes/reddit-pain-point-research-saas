"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Search, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NewScanPage() {
  const router = useRouter()
  const [keywords, setKeywords] = useState("")
  const [subreddits, setSubreddits] = useState("")
  const [timeRange, setTimeRange] = useState("30")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, subreddits, timeRange }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create scan")
      }

      const data = await response.json()
      router.push(`/dashboard/scans/${data.scanId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-radar-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-radar-600" />
            </div>
            <div>
              <CardTitle>Create New Scan</CardTitle>
              <CardDescription>
                Enter keywords to discover pain points from Reddit discussions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords *</Label>
              <Input
                id="keywords"
                placeholder="e.g., project management, todo app, productivity"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                required
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Enter keywords related to the market or problem you want to explore
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subreddits">Subreddits (optional)</Label>
              <Textarea
                id="subreddits"
                placeholder="e.g., productivity, Entrepreneur, SaaS"
                value={subreddits}
                onChange={(e) => setSubreddits(e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of subreddits to search within. Leave empty to search all.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How far back to search for posts
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
            )}

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading || !keywords.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Scan...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Tips for better results</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use specific keywords related to your target market</li>
            <li>• Include problem-focused terms like "help", "issue", "struggling"</li>
            <li>• Target relevant subreddits for more focused results</li>
            <li>• Longer time ranges capture more data but may include outdated discussions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
