import { NextResponse } from "next/server"
import { PLANS } from "@/lib/stripe"

/**
 * GET /api/stripe/plans
 * Get available subscription plans (public endpoint)
 */
export async function GET() {
  const plans = Object.entries(PLANS).map(([key, plan]) => ({
    id: key,
    name: plan.name,
    price: plan.price,
    priceId: plan.priceId,
    features: plan.features,
    popular: key === "regular", // Mark regular plan as popular
    interval: key.includes("yearly") ? "year" : "month",
  }))

  return NextResponse.json({ plans })
}
