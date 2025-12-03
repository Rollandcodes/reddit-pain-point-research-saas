import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe, verifyWebhookSignature } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = verifyWebhookSignature(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!userId) {
    console.error("No userId in checkout session metadata")
    return
  }

  console.log(`Checkout completed for user ${userId}`)

  // Track the event
  await prisma.analyticsEvent.create({
    data: {
      eventName: "subscription_created",
      userId,
      metadata: {
        customerId,
        subscriptionId,
        sessionId: session.id,
      },
    },
  })
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  const status = subscription.status
  const priceId = subscription.items.data[0]?.price.id

  if (!userId) {
    console.error("No userId in subscription metadata")
    return
  }

  console.log(`Subscription ${subscription.id} updated for user ${userId}: ${status}`)

  // Track the event
  await prisma.analyticsEvent.create({
    data: {
      eventName: "subscription_updated",
      userId,
      metadata: {
        subscriptionId: subscription.id,
        status,
        priceId,
      },
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error("No userId in subscription metadata")
    return
  }

  console.log(`Subscription ${subscription.id} deleted for user ${userId}`)

  // Track the event
  await prisma.analyticsEvent.create({
    data: {
      eventName: "subscription_canceled",
      userId,
      metadata: {
        subscriptionId: subscription.id,
      },
    },
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string
  const amountPaid = invoice.amount_paid

  console.log(`Payment succeeded: ${amountPaid / 100} for subscription ${subscriptionId}`)

  // You could also update a payments table here
  // or send a confirmation email
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string

  console.log(`Payment failed for subscription ${subscriptionId}`)

  // You could send a failed payment notification email here
  // or update user's subscription status
}
