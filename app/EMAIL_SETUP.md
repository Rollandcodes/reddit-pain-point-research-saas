# Email Notifications Setup

This project uses [Resend](https://resend.com) for transactional email notifications.

## Quick Setup

### 1. Install Resend (No npm package needed!)

We use Resend's HTTP API directly - no additional dependencies required.

### 2. Get Your API Key

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to your `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS="PainPointRadar <noreply@yourdomain.com>"
```

### 3. Verify Your Domain (Production)

For production, you need to verify your sending domain:

1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `painpointradar.com`)
3. Add the DNS records Resend provides
4. Update `EMAIL_FROM_ADDRESS` to use your verified domain

**For development**: Resend allows sending to your own email without domain verification.

## Usage Examples

### Send Scan Complete Email

```typescript
import { sendScanCompleteEmail } from '@/lib/email'

await sendScanCompleteEmail('user@example.com', {
  userName: 'John Doe',
  scanId: 'scan_123',
  subreddit: 'SaaS',
  painPointsFound: 25,
  viewUrl: 'https://painpointradar.com/dashboard/scans/scan_123',
})
```

### Send Welcome Email

```typescript
import { sendWelcomeEmail } from '@/lib/email'

await sendWelcomeEmail('newuser@example.com', {
  userName: 'Jane Smith',
  email: 'newuser@example.com',
})
```

### Send Payment Success Email

```typescript
import { sendPaymentSuccessEmail } from '@/lib/email'

await sendPaymentSuccessEmail('customer@example.com', {
  userName: 'John Doe',
  planName: 'Pro Plan',
  amount: 2900, // amount in cents ($29.00)
  nextBillingDate: '2025-01-04',
})
```

### Send Scan Failed Email

```typescript
import { sendScanFailedEmail } from '@/lib/email'

await sendScanFailedEmail('user@example.com', {
  userName: 'John Doe',
  scanId: 'scan_123',
  subreddit: 'PrivateSubreddit',
  errorMessage: 'Subreddit is private or does not exist',
  supportUrl: 'https://painpointradar.com/support',
})
```

## Integration Points

### 1. Scan Worker (Background Job)

Add to `app/workers/scan-worker.ts`:

```typescript
import { sendScanCompleteEmail, sendScanFailedEmail } from '@/lib/email'
import { clerkClient } from '@clerk/nextjs/server'

// On scan success
const user = await clerkClient.users.getUser(scan.userId)
await sendScanCompleteEmail(user.emailAddresses[0].emailAddress, {
  userName: user.firstName || 'there',
  scanId: scan.id,
  subreddit: scan.subreddit,
  painPointsFound: results.length,
  viewUrl: `${config.appUrl}/dashboard/scans/${scan.id}`,
})

// On scan failure
await sendScanFailedEmail(user.emailAddresses[0].emailAddress, {
  userName: user.firstName || 'there',
  scanId: scan.id,
  subreddit: scan.subreddit,
  errorMessage: error.message,
  supportUrl: `${config.appUrl}/support`,
})
```

### 2. User Sign-Up

Add to a webhook handler or sign-up flow:

```typescript
import { sendWelcomeEmail } from '@/lib/email'

// In your Clerk webhook handler for user.created
await sendWelcomeEmail(user.emailAddresses[0].emailAddress, {
  userName: user.firstName || 'there',
  email: user.emailAddresses[0].emailAddress,
})
```

### 3. Stripe Webhook (Payment Success)

Add to `app/api/stripe/webhook/route.ts`:

```typescript
import { sendPaymentSuccessEmail } from '@/lib/email'

// In checkout.session.completed handler
await sendPaymentSuccessEmail(customer.email, {
  userName: customer.name,
  planName: subscription.planName,
  amount: session.amount_total,
  nextBillingDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
})
```

## Email Templates

All email templates include:
- ✅ Responsive HTML design
- ✅ Plain text fallback
- ✅ Consistent branding
- ✅ Clear call-to-action buttons
- ✅ Mobile-friendly layout

### Customizing Templates

Edit templates in `app/lib/email.ts`. Each function has both `html` and `text` versions.

**Tips:**
- Keep subject lines under 50 characters
- Use emojis sparingly (1-2 per subject line)
- Test on mobile devices
- Include unsubscribe links for marketing emails

## Testing

### Development Mode

Without `RESEND_API_KEY` set, emails are logged to console instead of being sent:

```
⚠️ RESEND_API_KEY not configured - email not sent
📧 [DEV MODE] Email would be sent: {
  to: 'user@example.com',
  subject: '✅ Your r/SaaS scan is ready!',
  preview: 'Hi John, Your Reddit scan for r/SaaS is complete!...'
}
```

### Send Test Email

Create `app/api/test-email/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET() {
  const result = await sendWelcomeEmail('your-email@example.com', {
    userName: 'Test User',
    email: 'your-email@example.com',
  })
  
  return NextResponse.json({ success: result })
}
```

Visit `/api/test-email` to send a test.

## Production Checklist

- [ ] Add `RESEND_API_KEY` to production environment variables
- [ ] Verify your sending domain in Resend dashboard
- [ ] Update `EMAIL_FROM_ADDRESS` with verified domain
- [ ] Test all email templates
- [ ] Set up email monitoring in Resend dashboard
- [ ] Configure email bounce/complaint handling
- [ ] Add unsubscribe functionality if sending marketing emails

## Troubleshooting

### Emails not sending

1. Check API key is set: `echo $RESEND_API_KEY`
2. Check domain is verified (production only)
3. Check Resend dashboard for error logs
4. Verify `EMAIL_FROM_ADDRESS` format: `"Name <email@domain.com>"`

### Emails going to spam

1. Verify your domain with SPF/DKIM records
2. Use a dedicated sending domain (e.g., `mail.yourdomain.com`)
3. Avoid spam trigger words in subject lines
4. Include physical address in footer
5. Add unsubscribe link

### Rate limits

Resend free tier: 100 emails/day
- Upgrade to paid plan for higher limits
- Implement email queuing for bulk sends
- Use batch sending API for newsletters

## Alternative: SendGrid

To use SendGrid instead of Resend:

1. Install: `npm install @sendgrid/mail`
2. Update `config.ts` with SendGrid API key
3. Replace `sendEmail` function in `email.ts`:

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(config.email.sendgridApiKey)

export async function sendEmail(options: EmailOptions) {
  try {
    await sgMail.send({
      to: options.to,
      from: config.email.fromAddress,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}
```

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Email Design Best Practices](https://resend.com/docs/send-with-nodejs)
- [Transactional Email Guidelines](https://resend.com/docs/knowledge-base/transactional-emails)
