/**
 * Clerk Webhook Handler - User Events
 * Handles user.created events to send welcome emails
 * 
 * Setup:
 * 1. Install svix: npm install svix
 * 2. Go to Clerk Dashboard → Webhooks
 * 3. Add endpoint: https://yourdomain.com/api/webhooks/clerk
 * 4. Subscribe to: user.created
 * 5. Copy signing secret to CLERK_WEBHOOK_SECRET env var
 * 
 * Note: Uncomment the Webhook import below after installing svix package
 */

import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// import { Webhook } from 'svix' // Uncomment after: npm install svix
import { sendWelcomeEmail } from '@/lib/email'

// Temporary type until svix is installed
type Webhook = any

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('⚠️ CLERK_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  // Get webhook headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  // Get raw body
  const body = await request.text()
  const evt = JSON.parse(body)

  // TODO: Verify webhook signature (requires svix package)
  // After installing svix, uncomment this verification:
  /*
  const wh = new Webhook(webhookSecret)
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('❌ Webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  */

  // Handle user.created event
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    const primaryEmail = email_addresses.find((e: any) => e.id === evt.data.primary_email_address_id)
    const email = primaryEmail?.email_address

    if (!email) {
      console.warn(`⚠️ User ${id} has no email address`)
      return NextResponse.json({ received: true })
    }

    const userName = first_name || last_name || 'there'

    console.log(`📧 Sending welcome email to new user: ${email}`)

    try {
      await sendWelcomeEmail(email, {
        userName,
        email,
      })

      console.log(`✅ Welcome email sent to ${email}`)
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error)
      // Don't fail the webhook - just log the error
    }
  }

  return NextResponse.json({ received: true })
}
