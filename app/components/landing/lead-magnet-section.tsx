"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2, CheckCircle, BookOpen } from "lucide-react"

export function LeadMagnetSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // In production, this would send to your email service
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          role: "lead_magnet",
          useCase: "Downloaded: 10 Reddit Communities Guide" 
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Something went wrong")
      }

      setIsSuccess(true)
      // In production, trigger download or email the PDF
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-radar-50 to-background">
      <div className="container px-4 sm:px-6">
        <Card className="max-w-2xl mx-auto border-2 border-radar-200 overflow-hidden">
          <div className="bg-radar-600 p-4 sm:p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-medium text-radar-100">FREE GUIDE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              10 Reddit Communities for SaaS Ideas
            </h3>
            <p className="text-radar-100 mt-2">
              Discover the best subreddits to find validated problems worth solving
            </p>
          </div>
          
          <CardContent className="p-4 sm:p-6">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Check your email!</h4>
                <p className="text-muted-foreground">
                  We&apos;ve sent the guide to your inbox. Also added you to our waitlist for early access.
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  Inside this free guide, you&apos;ll discover:
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-radar-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>10 high-signal subreddits where users openly share frustrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-radar-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>How to identify pain points that lead to profitable SaaS ideas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-radar-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Real examples of SaaS products born from Reddit research</span>
                  </li>
                </ul>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !email}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        Get Free Guide
                      </>
                    )}
                  </Button>
                </form>

                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
