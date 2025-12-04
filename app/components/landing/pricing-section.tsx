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
    period: "/forever",
    description: "Try PainPointRadar with no commitment",
    features: [
      "3 free scans",
      "Unlimited subreddits",
      "AI clustering & scoring",
      "CSV export",
      "7-day report retention",
    ],
    cta: "Start Free",
    href: "#waitlist",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For founders validating multiple ideas",
    features: [
      "10 scans per month",
      "Unlimited subreddits",
      "Priority processing",
      "30-day report retention",
      "Email support",
      "PDF export",
    ],
    cta: "Join Waitlist",
    href: "#waitlist",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$79",
    period: "/month",
    description: "For agencies and power users",
    features: [
      "Unlimited scans",
      "Unlimited subreddits",
      "Priority support",
      "Unlimited retention",
      "API access",
      "Custom integrations",
      "Team collaboration",
    ],
    cta: "Join Waitlist",
    href: "#waitlist",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-4 bg-green-600">🎉 Launch Pricing - Lock in now!</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Start with 3 free scans. No credit card required. Cancel anytime.
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

        <div className="text-center text-sm text-muted-foreground mt-8 space-y-2">
          <p>✅ 14-day money-back guarantee on all paid plans. No questions asked.</p>
          <p className="font-medium">🚀 Lock in launch pricing before it increases. Early adopters save 40%.</p>
        </div>
      </div>
    </section>
  )
}
