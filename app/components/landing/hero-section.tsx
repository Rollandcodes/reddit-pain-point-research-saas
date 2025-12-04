"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, CheckCircle2, Lock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="hero-heading">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(14,165,233,0.12),transparent)]" aria-hidden="true" />
      
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-3 sm:px-4 py-1.5 text-xs sm:text-sm">
            <span className="mr-2">🚀</span>
            <span>Join 500+ founders on the waitlist</span>
          </div>

          {/* Headline */}
          <h1 id="hero-heading" className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Get AI-Ranked List of{" "}
            <span className="bg-gradient-to-r from-radar-600 to-radar-400 bg-clip-text text-transparent">
              50+ Customer Pain Points
            </span>
            {" "}from Reddit in 5 Minutes
          </h1>

          {/* Subheading with concrete numbers */}
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl font-semibold text-foreground max-w-3xl mx-auto px-2 sm:px-0">
            Analyze 1,000+ posts → Get 10-20 clustered pain point opportunities
          </p>

          {/* Benefit-focused description */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto px-2 sm:px-0">
            Validate your SaaS idea before writing code. Our AI scans thousands of Reddit discussions, identifies patterns, and ranks opportunities by market demand—so you build what people actually need.
          </p>

          {/* Trust indicator */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-radar-500" aria-hidden="true" />
            <span className="font-medium">Join 500+ founders discovering validated SaaS ideas</span>
          </div>

          {/* CTAs - More prominent */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="#waitlist" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 h-auto font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Scan
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/sample-report" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 h-auto font-semibold border-2"
              >
                View Sample Report
              </Button>
            </Link>
          </div>

          {/* Risk reversal & trust indicators */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>3 free scans included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>Results in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
