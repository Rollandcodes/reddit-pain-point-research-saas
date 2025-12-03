import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs"
import {
  createCheckoutSession,
  createPaymentIntent,
  getOrCreateCustomer,
  createBillingPortalSession,
  PLANS,
  type PlanType,
} from "@/lib/stripe"

/**
 * POST /api/stripe
 * Create a checkout session or payment intent
 */
export async function POST(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await currentUser()
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    const body = await request.json()
    const { action, planType, amount } = body

    const email = user.emailAddresses[0].emailAddress
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer({
      email,
      userId,
      name,
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    switch (action) {
      case "checkout": {
        // Create subscription checkout session
        if (!planType || !(planType in PLANS)) {
          return NextResponse.json(
            { error: "Invalid plan type" },
            { status: 400 }
          )
        }

        const plan = PLANS[planType as PlanType]
        const session = await createCheckoutSession({
          priceId: plan.priceId,
          customerId: customer.id,
          userId,
          successUrl: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/dashboard?canceled=true`,
        })

        return NextResponse.json({
          success: true,
          sessionId: session.id,
          url: session.url,
        })
      }

      case "payment_intent": {
        // Create one-time payment intent
        if (!amount || typeof amount !== "number" || amount <= 0) {
          return NextResponse.json(
            { error: "Invalid amount" },
            { status: 400 }
          )
        }

        const paymentIntent = await createPaymentIntent({
          amount,
          customerId: customer.id,
          metadata: {
            userId,
            email,
          },
        })

        return NextResponse.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        })
      }

      case "billing_portal": {
        // Create billing portal session
        const session = await createBillingPortalSession({
          customerId: customer.id,
          returnUrl: `${baseUrl}/dashboard`,
        })

        return NextResponse.json({
          success: true,
          url: session.url,
        })
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Stripe API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/stripe
 * Get available plans or payment intent status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentIntentId = searchParams.get("payment_intent_id")

  // If payment intent ID is provided, retrieve its status
  if (paymentIntentId) {
    try {
      const { userId } = auth()

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const { getPaymentIntent } = await import("@/lib/stripe")
      const paymentIntent = await getPaymentIntent(paymentIntentId)

      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          created: paymentIntent.created,
        },
      })
    } catch (error) {
      console.error("Error retrieving payment intent:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Internal server error" },
        { status: 500 }
      )
    }
  }

  // Otherwise, return available plans
  return NextResponse.json({
    plans: Object.entries(PLANS).map(([key, plan]) => ({
      id: key,
      ...plan,
    })),
  })
}
