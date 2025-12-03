"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  planId: string
  name: string
  price: number
  features: string[]
  popular?: boolean
  yearly?: boolean
  onSubscribe?: (planId: string) => Promise<void>
}

export function PricingCard({
  planId,
  name,
  price,
  features,
  popular = false,
  yearly = false,
  onSubscribe,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    if (onSubscribe) {
      setIsLoading(true)
      try {
        await onSubscribe(planId)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className={cn(
      "relative flex flex-col",
      popular && "border-radar-500 shadow-lg scale-105"
    )}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-radar-500">
          Most Popular
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">/{yearly ? "year" : "month"}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={popular ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
