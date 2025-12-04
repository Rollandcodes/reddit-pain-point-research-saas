# Email Notifications - Quick Start

## ✅ What's Been Set Up

1. **Email Service Module** (`app/lib/email.ts`)
   - Uses Resend API (no npm dependencies needed)
   - 4 pre-built email templates with responsive HTML + plain text
   - Automatic fallback to console logging in development

2. **Email Templates**
   - 📧 Welcome email (new user onboarding)
   - ✅ Scan complete notification (with results summary)
   - 💳 Payment success confirmation (with receipt)
   - ⚠️ Scan failure alert (with error details)

3. **Configuration** (updated `app/lib/config.ts`)
   - Added `config.email` section
   - Environment variables: `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`

4. **Integration** (updated `app/workers/scan-worker.ts`)
   - Sends email on scan completion
   - Sends email on scan failure
   - Non-blocking (won't fail job if email fails)

5. **Test Endpoint** (`app/api/test-email/route.ts`)
   - Test all email types via browser
   - Works in development without API key

## 🚀 Get Started (5 minutes)

### Step 1: Get Resend API Key (2 min)
```bash
# 1. Sign up at https://resend.com (free tier: 100 emails/day)
# 2. Copy API key from dashboard
```

### Step 2: Add to Environment (1 min)
```bash
# Add to app/.env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS="PainPointRadar <noreply@painpointradar.com>"
```

### Step 3: Test It (2 min)
```bash
# Start your dev server
npm run dev

# Visit in browser:
http://localhost:3000/api/test-email?type=welcome
http://localhost:3000/api/test-email?type=scan
http://localhost:3000/api/test-email?type=payment
http://localhost:3000/api/test-email?type=failure
```

## 📝 Usage Examples

### In API Routes
```typescript
import { sendScanCompleteEmail } from '@/lib/email'

await sendScanCompleteEmail('user@example.com', {
  userName: 'John',
  scanId: 'scan_123',
  subreddit: 'SaaS',
  painPointsFound: 25,
  viewUrl: 'https://app.com/scans/123',
})
```

### In Webhooks (Stripe)
```typescript
import { sendPaymentSuccessEmail } from '@/lib/email'

// In app/api/stripe/webhook/route.ts
await sendPaymentSuccessEmail(customer.email, {
  userName: customer.name,
  planName: 'Pro Plan',
  amount: 2900, // cents
  nextBillingDate: '2025-01-04',
})
```

### In User Sign-Up
```typescript
import { sendWelcomeEmail } from '@/lib/email'

// In Clerk webhook or sign-up flow
await sendWelcomeEmail(user.email, {
  userName: user.firstName || 'there',
  email: user.email,
})
```

## 🎨 Customizing Templates

Edit `app/lib/email.ts` - each function has both HTML and plain text versions:

```typescript
export async function sendScanCompleteEmail(to: string, data: ScanCompleteEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <!-- Your custom HTML here -->
    </html>
  `
  
  const text = `Your plain text version here`
  
  return sendEmail({ to, subject: '...', html, text })
}
```

## 📦 No Dependencies Required

Resend uses a simple HTTP API - no npm packages needed! We use native `fetch()`.

If you prefer SendGrid instead:
1. `npm install @sendgrid/mail`
2. See `app/EMAIL_SETUP.md` for migration guide

## 🔍 Debugging

### Development Mode (no API key)
Emails are logged to console:
```
⚠️ RESEND_API_KEY not configured - email not sent
📧 [DEV MODE] Email would be sent: {...}
```

### Production Issues
1. Check Resend dashboard → Logs
2. Verify domain is verified (production only)
3. Check email format: `"Name <email@domain.com>"`

## 📚 Full Documentation

See `app/EMAIL_SETUP.md` for:
- Domain verification steps
- Production deployment checklist
- Email design best practices
- Troubleshooting guide
- Alternative providers (SendGrid)

## ✨ Features

- ✅ Responsive HTML design (mobile-friendly)
- ✅ Plain text fallback for email clients
- ✅ Consistent branding and styling
- ✅ Clear call-to-action buttons
- ✅ Development mode with console logging
- ✅ Non-blocking (won't crash your app)
- ✅ TypeScript type safety

## 🎯 Next Steps

1. **Add welcome email** - Send on user sign-up (Clerk webhook)
2. **Add payment emails** - Integrate with Stripe webhook
3. **Customize templates** - Match your brand colors/style
4. **Verify domain** - For production (prevents spam folder)
5. **Monitor delivery** - Check Resend dashboard regularly

Need help? Check the full guide in `EMAIL_SETUP.md`!
