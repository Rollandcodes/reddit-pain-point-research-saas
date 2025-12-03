"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DemoVideoSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            See PainPointRadar in Action
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Watch how we turn Reddit discussions into actionable pain point insights in minutes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Video Placeholder */}
          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border bg-gradient-to-br from-radar-50 to-radar-100 shadow-lg">
            {/* Placeholder content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-radar-600 flex items-center justify-center shadow-lg hover:bg-radar-700 transition-colors cursor-pointer group">
                  <Play className="h-10 w-10 text-white ml-1 group-hover:scale-110 transition-transform" fill="currentColor" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Demo Video Coming Soon</p>
              </div>
            </div>
            
            {/* Mock video frame overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true" />
            
            {/* Corner decoration */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm border text-xs font-medium text-muted-foreground">
                Product Demo
              </div>
            </div>
          </div>

          {/* Video description */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Learn how to discover validated pain points, analyze sentiment, and export insights to CSV
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

