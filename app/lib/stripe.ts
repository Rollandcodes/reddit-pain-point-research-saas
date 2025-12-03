import Stripe from "stripe"

// Initialize Stripe with your secret key
// Make sure to set STRIPE_SECRET_KEY in your environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

// Product/Price IDs - Set these in your Stripe Dashboard
export const STRIPE_PRICES = {
  EARLY_BIRD: process.env.STRIPE_PRICE_EARLY_BIRD || "price_early_bird",
  REGULAR: process.env.STRIPE_PRICE_REGULAR || "price_regular",
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY || "price_pro_yearly",
} as const

// Plan configurations
export const PLANS = {
  early_bird: {
    name: "Early Bird",
    price: 20,
    priceId: STRIPE_PRICES.EARLY_BIRD,
    features: [
      "5 pain point scans per month",
      "Basic clustering analysis",
      "CSV export",
      "Email support",
    ],
  },
  regular: {
    name: "Regular",
    price: 50,
    priceId: STRIPE_PRICES.REGULAR,
    features: [
      "15 pain point scans per month",
      "Advanced clustering with AI",
      "CSV + Excel export",
      "Priority email support",
      "Custom subreddit targeting",
    ],
  },
  pro_monthly: {
    name: "Pro Monthly",
    price: 99,
    priceId: STRIPE_PRICES.PRO_MONTHLY,
    features: [
      "Unlimited scans",
      "AI-powered analysis",
      "All export formats",
      "API access",
      "Priority support",
      "Custom integrations",
    ],
  },
  pro_yearly: {
    name: "Pro Yearly",
    price: 990,
    priceId: STRIPE_PRICES.PRO_YEARLY,
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Dedicated account manager",
    ],
  },
} as const

export type PlanType = keyof typeof PLANS

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession({
  priceId,
  customerId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  customerId?: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    ...(customerId ? { customer: customerId } : {}),
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  return session
}

/**
 * Create a one-time payment intent
 */
export async function createPaymentIntent({
  amount,
  currency = "usd",
  customerId,
  metadata,
}: {
  amount: number
  currency?: string
  customerId?: string
  metadata?: Record<string, string>
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe uses cents
    currency,
    ...(customerId ? { customer: customerId } : {}),
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer({
  email,
  userId,
  name,
}: {
  email: string
  userId: string
  name?: string
}) {
  // Search for existing customer by email
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  })

  return customer
}

/**
 * Get customer's active subscriptions
 */
export async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
  })

  return subscriptions.data
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

/**
 * Create a billing portal session for customer to manage subscription
 */
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams
) {
  const subscription = await stripe.subscriptions.update(subscriptionId, params)
  return subscription
}

/**
 * Retrieve a payment intent by ID
 */
export async function getPaymentIntent(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

/**
 * Confirm a payment intent (useful for server-side confirmation)
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId?: string
) {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    ...(paymentMethodId ? { payment_method: paymentMethodId } : {}),
  })
  return paymentIntent
}
