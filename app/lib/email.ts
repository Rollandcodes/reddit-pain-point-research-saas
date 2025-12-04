/**
 * Email service using Resend
 * Handles sending transactional emails for user notifications
 */

import { config } from './config'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

interface ScanCompleteEmailData {
  userName: string
  scanId: string
  subreddit: string
  painPointsFound: number
  viewUrl: string
}

interface WelcomeEmailData {
  userName: string
  email: string
}

interface PaymentSuccessEmailData {
  userName: string
  planName: string
  amount: number
  nextBillingDate: string
}

interface ScanFailedEmailData {
  userName: string
  scanId: string
  subreddit: string
  errorMessage: string
  supportUrl: string
}

/**
 * Base email sending function using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = config.email.resendApiKey

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY not configured - email not sent')
    if (config.isDevelopment) {
      console.log('📧 [DEV MODE] Email would be sent:', {
        to: options.to,
        subject: options.subject,
        preview: options.text?.substring(0, 100) || options.html.substring(0, 100),
      })
    }
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.email.fromAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Failed to send email:', error)
      return false
    }

    const data = await response.json()
    console.log('✅ Email sent successfully:', data.id)
    return true
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}

/**
 * Send scan completion notification
 */
export async function sendScanCompleteEmail(
  to: string,
  data: ScanCompleteEmailData
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .stats { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stat { margin: 10px 0; font-size: 16px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 Your Scan is Complete!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>Great news! Your Reddit scan for <strong>r/${data.subreddit}</strong> has finished processing.</p>
      
      <div class="stats">
        <div class="stat">📊 <strong>Pain Points Found:</strong> ${data.painPointsFound}</div>
        <div class="stat">🎯 <strong>Subreddit:</strong> r/${data.subreddit}</div>
        <div class="stat">🆔 <strong>Scan ID:</strong> ${data.scanId}</div>
      </div>
      
      <p>We've analyzed hundreds of conversations to identify the most pressing pain points and business opportunities in your niche.</p>
      
      <a href="${data.viewUrl}" class="button">View Your Results →</a>
      
      <p>Your report includes:</p>
      <ul>
        <li>Ranked pain points with severity scores</li>
        <li>Competition analysis</li>
        <li>Revenue potential estimates</li>
        <li>AI-generated solution suggestions</li>
      </ul>
      
      <p>Happy building! 🚀</p>
      <p>– The PainPointRadar Team</p>
    </div>
    <div class="footer">
      <p>PainPointRadar | Discover your next SaaS idea from Reddit</p>
      <p><a href="${config.appUrl}/dashboard">Dashboard</a> | <a href="${config.appUrl}/privacy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Hi ${data.userName},

Your Reddit scan for r/${data.subreddit} is complete!

Pain Points Found: ${data.painPointsFound}
Scan ID: ${data.scanId}

View your results: ${data.viewUrl}

– The PainPointRadar Team
  `.trim()

  return sendEmail({
    to,
    subject: `✅ Your r/${data.subreddit} scan is ready!`,
    html,
    text,
  })
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  to: string,
  data: WelcomeEmailData
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">👋 Welcome to PainPointRadar!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>Welcome aboard! We're excited to help you discover your next SaaS opportunity by analyzing real pain points from Reddit.</p>
      
      <h3>🚀 Getting Started</h3>
      <p>Here's how to find your first opportunity:</p>
      <ol>
        <li><strong>Run a free scan</strong> – Analyze any subreddit to see what people are struggling with</li>
        <li><strong>Review the insights</strong> – We rank pain points by severity and revenue potential</li>
        <li><strong>Validate your idea</strong> – See competition levels and market size estimates</li>
        <li><strong>Build & launch</strong> – Use AI-generated solution ideas as your starting point</li>
      </ol>
      
      <a href="${config.appUrl}/dashboard" class="button">Start Your First Scan →</a>
      
      <h3>💡 Pro Tips</h3>
      <ul>
        <li>Start with niche subreddits (10k-100k members) for focused opportunities</li>
        <li>Look for recurring complaints – they indicate real pain points</li>
        <li>Check the "buying signals" score – people willing to pay for solutions</li>
      </ul>
      
      <p>Need help? Just reply to this email – we're here to help!</p>
      <p>Happy hunting! 🎯</p>
      <p>– The PainPointRadar Team</p>
    </div>
    <div class="footer">
      <p>PainPointRadar | Discover your next SaaS idea from Reddit</p>
      <p><a href="${config.appUrl}/dashboard">Dashboard</a> | <a href="${config.appUrl}/privacy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Hi ${data.userName},

Welcome to PainPointRadar! We're excited to help you discover your next SaaS opportunity.

Getting Started:
1. Run a free scan on any subreddit
2. Review pain points ranked by severity
3. Validate ideas with competition & revenue data
4. Build your solution!

Start your first scan: ${config.appUrl}/dashboard

– The PainPointRadar Team
  `.trim()

  return sendEmail({
    to,
    subject: '👋 Welcome to PainPointRadar - Find Your Next SaaS Idea',
    html,
    text,
  })
}

/**
 * Send payment success notification
 */
export async function sendPaymentSuccessEmail(
  to: string,
  data: PaymentSuccessEmailData
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .receipt { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ Payment Successful!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>Thank you for subscribing to <strong>${data.planName}</strong>! Your payment has been processed successfully.</p>
      
      <div class="receipt">
        <h3 style="margin-top: 0;">Receipt</h3>
        <p><strong>Plan:</strong> ${data.planName}</p>
        <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
        <p><strong>Next Billing Date:</strong> ${data.nextBillingDate}</p>
      </div>
      
      <p>You now have full access to all premium features:</p>
      <ul>
        <li>✅ Unlimited scans</li>
        <li>✅ Advanced AI analysis</li>
        <li>✅ Competition tracking</li>
        <li>✅ Revenue estimates</li>
        <li>✅ Priority support</li>
      </ul>
      
      <a href="${config.appUrl}/dashboard" class="button">Go to Dashboard →</a>
      
      <p>Questions about your subscription? Visit your <a href="${config.appUrl}/dashboard">account settings</a> or reply to this email.</p>
      <p>– The PainPointRadar Team</p>
    </div>
    <div class="footer">
      <p>PainPointRadar | Discover your next SaaS idea from Reddit</p>
      <p><a href="${config.appUrl}/dashboard">Dashboard</a> | <a href="${config.appUrl}/privacy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Hi ${data.userName},

Thank you for subscribing to ${data.planName}!

Receipt:
- Plan: ${data.planName}
- Amount: $${(data.amount / 100).toFixed(2)}
- Next Billing: ${data.nextBillingDate}

You now have access to all premium features.

Dashboard: ${config.appUrl}/dashboard

– The PainPointRadar Team
  `.trim()

  return sendEmail({
    to,
    subject: '✅ Payment Successful - Welcome to Premium!',
    html,
    text,
  })
}

/**
 * Send scan failure notification
 */
export async function sendScanFailedEmail(
  to: string,
  data: ScanFailedEmailData
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .error-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⚠️ Scan Failed</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>We encountered an issue while processing your scan for <strong>r/${data.subreddit}</strong>.</p>
      
      <div class="error-box">
        <strong>Error Details:</strong><br>
        ${data.errorMessage}
      </div>
      
      <p><strong>Scan ID:</strong> ${data.scanId}</p>
      
      <h3>What to do next:</h3>
      <ul>
        <li>Check if the subreddit name is correct</li>
        <li>Ensure the subreddit is public (not private or banned)</li>
        <li>Try running the scan again in a few minutes</li>
      </ul>
      
      <a href="${config.appUrl}/dashboard/new-scan" class="button">Try Again →</a>
      
      <p>If the problem persists, please <a href="${data.supportUrl}">contact our support team</a> with the scan ID above.</p>
      <p>– The PainPointRadar Team</p>
    </div>
    <div class="footer">
      <p>PainPointRadar | Discover your next SaaS idea from Reddit</p>
      <p><a href="${config.appUrl}/dashboard">Dashboard</a> | <a href="${config.appUrl}/privacy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Hi ${data.userName},

Your scan for r/${data.subreddit} failed to process.

Error: ${data.errorMessage}
Scan ID: ${data.scanId}

What to do:
- Verify the subreddit name is correct
- Ensure it's a public subreddit
- Try again: ${config.appUrl}/dashboard/new-scan

Need help? Contact support: ${data.supportUrl}

– The PainPointRadar Team
  `.trim()

  return sendEmail({
    to,
    subject: `⚠️ Scan failed for r/${data.subreddit}`,
    html,
    text,
  })
}
