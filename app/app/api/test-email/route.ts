/**
 * Test endpoint for email functionality
 * GET /api/test-email?type=welcome|scan|payment|failure
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  sendWelcomeEmail,
  sendScanCompleteEmail,
  sendPaymentSuccessEmail,
  sendScanFailedEmail,
} from '@/lib/email'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { config } from '@/lib/config'

export async function GET(request: NextRequest) {
  // Only allow in development or for authenticated admins
  if (config.isProduction) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'welcome'

  try {
    // Get current user's email
    const { userId } = await auth()
    let userEmail = 'test@example.com'
    let userName = 'Test User'

    if (userId) {
      const user = await clerkClient.users.getUser(userId)
      userEmail = user.emailAddresses[0]?.emailAddress || userEmail
      userName = user.firstName || userName
    }

    let result = false

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(userEmail, {
          userName,
          email: userEmail,
        })
        break

      case 'scan':
        result = await sendScanCompleteEmail(userEmail, {
          userName,
          scanId: 'test_scan_123',
          subreddit: 'SaaS',
          painPointsFound: 42,
          viewUrl: `${config.appUrl}/dashboard/scans/test_scan_123`,
        })
        break

      case 'payment':
        result = await sendPaymentSuccessEmail(userEmail, {
          userName,
          planName: 'Pro Plan',
          amount: 2900, // $29.00
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        })
        break

      case 'failure':
        result = await sendScanFailedEmail(userEmail, {
          userName,
          scanId: 'test_scan_456',
          subreddit: 'PrivateSubreddit',
          errorMessage: 'Subreddit is private or does not exist',
          supportUrl: `${config.appUrl}/support`,
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: welcome, scan, payment, or failure' },
          { status: 400 }
        )
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully to ${userEmail}`,
        note: config.email.enabled
          ? 'Email was sent via Resend'
          : 'Email was logged to console (RESEND_API_KEY not configured)',
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email sending failed',
        note: 'Check server logs for details',
      })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
