"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

const screenshots = [
  {
    title: "1. Enter Keywords & Select Subreddits",
    description: "Start your scan by entering pain point keywords like 'too expensive' or 'frustrated with'. Choose target subreddits or let our AI discover them automatically.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
    alt: "PainPointRadar keyword entry interface with subreddit selection",
  },
  {
    title: "2. AI Analyzes & Clusters Pain Points",
    description: "Our AI scans 1,000+ Reddit posts in real-time, groups similar complaints using semantic clustering, and calculates opportunity scores (0-100) based on frequency, sentiment, and urgency.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
    alt: "Pain point clustering analysis in progress with AI-powered grouping",
  },
  {
    title: "3. View Ranked Results & Export",
    description: "Get 10-20 clustered pain points ranked by opportunity score. Each cluster includes post count, sentiment analysis, real quotes, and sources. Export everything to CSV with one click.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&q=80",
    alt: "Ranked pain point results with opportunity scores and CSV export option",
  },
]

export function ProductScreenshotsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Powerful Features, Simple Interface
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Everything you need to discover and validate pain points from Reddit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {screenshots.map((screenshot, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-muted border-b overflow-hidden">
                {/* Unsplash placeholder image */}
                <Image
                  src={screenshot.image}
                  alt={screenshot.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true" />
                
                {/* Mock browser frame */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-muted/90 backdrop-blur-sm border-b flex items-center gap-2 px-3 z-10">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-lg mb-2">{screenshot.title}</h3>
                <p className="text-sm text-muted-foreground">{screenshot.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

