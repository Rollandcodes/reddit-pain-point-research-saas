"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah K.",
    role: "Indie Founder",
    content: "Found 12 validated pain points in 5 minutes",
    rating: 5,
    avatar: "SK",
  },
  {
    name: "Mike T.",
    role: "Product Manager",
    content: "Saved me 3 weeks of manual Reddit research",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Alex R.",
    role: "Developer",
    content: "The opportunity scores helped me prioritize features",
    rating: 5,
    avatar: "AR",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Loved by Founders & Builders
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            See how PainPointRadar is helping entrepreneurs discover validated problems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm sm:text-base text-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-radar-100 flex items-center justify-center text-radar-700 font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          More testimonials coming soon. Join our waitlist to be featured!
        </p>
      </div>
    </section>
  )
}

