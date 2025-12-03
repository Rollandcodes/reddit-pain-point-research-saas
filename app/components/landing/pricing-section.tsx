"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out PainPointRadar",
    features: [
      "3 scans per month",
      "Basic pain point clustering",
      "CSV export",
      "7-day data retention",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "For serious indie hackers and founders",
    features: [
      "Unlimited scans",
      "Priority processing queue",
      "Advanced AI insights",
      "Sentiment analysis",
      "30-day data retention",
      "Email support",
    ],
    cta: "Start Pro Trial",
    href: "/sign-up?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$40",
    period: "/month",
    description: "For teams and power users",
    features: [
      "Everything in Pro",
      "Custom dashboards",
      "API access",
      "Advanced filtering",
      "Unlimited data retention",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Contact Sales",
    href: "/sign-up?plan=premium",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                plan.highlighted 
                  ? 'border-radar-500 border-2 shadow-lg scale-105' 
                  : 'border-border'
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-radar-600">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-radar-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  )
}
