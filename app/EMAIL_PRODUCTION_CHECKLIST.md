# Email System Production Checklist

## 1. Environment Variables

Ensure the following are set in your deployment environment (`.env.production`, Vercel/Render/Railway dashboard, etc.):

### Required
- `RESEND_API_KEY` — Your Resend API key (format: `re_xxx...`)
  - Get from: https://resend.com/api-keys
- `EMAIL_FROM_ADDRESS` — Sender email address with brand name
  - Example: `"PainPointRadar <noreply@painpointradar.me>"`
  - **Important:** Domain must be verified in Resend before sending
- `CLERK_WEBHOOK_SECRET` — Signing secret for Clerk webhooks
  - Get from: Clerk Dashboard → Webhooks → Signing Secret (copy from endpoint details)

### Optional (for webhook integrations)
- `STRIPE_WEBHOOK_SECRET` — Already configured; used for payment emails

---

## 2. Configuration Status

Based on current `.env.local`:

| Variable | Status | Value |
|----------|--------|-------|
| `RESEND_API_KEY` | ✅ Set | `re_aNBn3xK1_QBk...` |
| `EMAIL_FROM_ADDRESS` | ✅ Set | `"PainPointRadar <noreply@painpointradar.me>"` |
| `CLERK_WEBHOOK_SECRET` | ⏳ Pending | Add to `.env.local` and production env |

---

## 3. Domain Verification (Resend)

**Required for production sending:**

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain: `painpointradar.me`
4. Add the following DNS records:
   - **SPF Record:**
     ```
     Type: TXT
     Name: @
     Value: v=spf1 include:resend.com ~all
     ```
   - **DKIM Record:**
     ```
     Type: CNAME
     Name: [resend-provided]
     Value: [resend-provided]
     ```
   - **DMARC Record (optional but recommended):**
     ```
     Type: TXT
     Name: _dmarc
     Value: v=DMARC1; p=quarantine; rua=mailto:noreply@painpointradar.me
     ```
5. Verify in Resend dashboard (can take 24-48 hours)

---

## 4. Clerk Webhook Setup

**To enable automatic welcome emails on user signup:**

1. Go to Clerk Dashboard → Webhooks
2. Click "Add Endpoint"
3. Configure:
   - **URL:** `https://yourdomain.com/api/webhooks/clerk`
   - **Events:** Select `user.created`
4. Copy the **Signing Secret** and add to env as `CLERK_WEBHOOK_SECRET`
5. Test webhook:
   - Clerk Dashboard → Webhooks → Test Endpoint
   - Should return `{ "ok": true }`

---

## 5. Email Integration Points

### User.created Event (Clerk Webhook)
- **Trigger:** User signs up
- **Handler:** `/api/webhooks/clerk/route.ts`
- **Email:** Welcome email via `sendWelcomeEmail()`
- **Verification:** Uses `CLERK_WEBHOOK_SECRET` with svix

### Scan Complete Event (Background Worker)
- **Trigger:** Scan finishes (`src/workers/scan-worker.ts`)
- **Email:** "Your scan is complete" via `sendScanCompleteEmail()`
- **Fallback:** Logs to console if `RESEND_API_KEY` missing

### Scan Failed Event (Background Worker)
- **Trigger:** Scan fails
- **Email:** "Scan failed" notification via `sendScanFailedEmail()`

### Payment Success Event (Stripe Webhook)
- **Trigger:** Successful checkout (`checkout.session.completed`)
- **Handler:** `/api/stripe/webhook/route.ts`
- **Email:** Payment success via `sendPaymentSuccessEmail()`

---

## 6. Testing Locally

### Test Email Endpoint
```bash
# Terminal 1: Start dev server
cd app
npm run dev

# Terminal 2: Test welcome email (after server is Ready)
curl "http://localhost:3000/api/test-email?type=welcome"

# Options:
# ?type=welcome      → Send welcome email
# ?type=scan         → Send scan complete email
# ?type=payment      → Send payment success email
# ?type=failure      → Send scan failed email
```

**Expected response (with real RESEND_API_KEY):**
```json
{
  "message": "Test email sent",
  "emailType": "welcome",
  "recipient": "user@example.com"
}
```

### Check Configuration
```bash
cd app
node check-email-config.js
```

**Output should show:**
- ✅ Resend API Key configured
- ✅ From address valid
- ⏳ Clerk Webhook Secret (if not set locally)

---

## 7. Production Deployment

### Vercel
1. Go to Project Settings → Environment Variables
2. Add for all environments (`Production`, `Preview`, `Development`):
   - `RESEND_API_KEY`
   - `EMAIL_FROM_ADDRESS`
   - `CLERK_WEBHOOK_SECRET`
3. Redeploy

### Render / Railway / Other
1. Update environment variables in dashboard
2. Restart services
3. Monitor logs for email send errors

---

## 8. Monitoring & Debugging

### Check Email Sending
```bash
# Resend dashboard: https://resend.com/emails
# Shows all sent/failed emails with delivery status
```

### Debug Logs
- **Local:** `npm run dev` output shows Resend API calls
- **Production:** Check deployment provider logs (Vercel, Render, etc.)

### Common Issues

| Issue | Solution |
|-------|----------|
| "Missing RESEND_API_KEY" | Add to `.env.local` / production env vars |
| "Invalid signature" (Clerk webhook) | Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard |
| "Domain not verified" (Resend) | Add DNS records and wait 24-48 hours |
| Email not received | Check spam folder; verify `EMAIL_FROM_ADDRESS` domain |

---

## 9. Template Customization

To update email templates (colors, branding, copy):

```bash
cd app
node customize-emails.js
```

Edits to `app/lib/email.ts`:
- Update `brandColor` hex value
- Modify email copy and layout
- Change footer branding

---

## 10. Quick Links

- **Resend Dashboard:** https://resend.com
- **Clerk Webhooks:** https://dashboard.clerk.com/webhooks
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks
- **Email Service Documentation:** `EMAIL_README.md`
- **Setup Helper:** `node setup-email.js`

---

**Last Updated:** December 4, 2025  
**Status:** Email system ready for production setup
