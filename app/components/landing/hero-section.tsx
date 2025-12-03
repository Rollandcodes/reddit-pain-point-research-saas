"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="hero-heading">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(14,165,233,0.12),transparent)]" aria-hidden="true" />
      
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-3 sm:px-4 py-1.5 text-xs sm:text-sm">
            <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-radar-500" aria-hidden="true" />
            <span>Now in beta — Join 500+ founders on the waitlist</span>
          </div>

          {/* Headline */}
          <h1 id="hero-heading" className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Discover Reddit Pain Points.{" "}
            <span className="bg-gradient-to-r from-radar-600 to-radar-400 bg-clip-text text-transparent">
              Build What People Need.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto px-2 sm:px-0">
            Turn thousands of Reddit posts into a launch-ready SaaS idea in minutes. 
            Find validated problems before you write a single line of code.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#waitlist">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Join waitlist & get 3 free scans
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/sample-report">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                View sample report
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-muted-foreground">
            Trusted by indie hackers building on Reddit insights
          </p>
        </div>
      </div>
    </section>
  )
}
