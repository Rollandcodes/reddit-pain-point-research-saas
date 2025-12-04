# Email Setup - Step-by-Step Checklist

## ✅ Task 1: Test the Email Endpoint

### Prerequisites
1. Get Resend API key from https://resend.com (free tier: 100 emails/day)
2. Create `.env.local` file in the `app` directory

### Setup Steps

1. **Create `.env.local` file** (copy from `.env.example`):
```bash
cd app
cp .env.example .env.local
```

2. **Add your Resend API key** to `app/.env.local`:
```bash
# Email (Resend) - Required for testing
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS="PainPointRadar <noreply@yourdomain.com>"
```

3. **Start the dev server**:
```bash
npm run dev
```

4. **Test each email template**:
- Welcome email: http://localhost:3000/api/test-email?type=welcome
- Scan complete: http://localhost:3000/api/test-email?type=scan
- Payment success: http://localhost:3000/api/test-email?type=payment
- Scan failed: http://localhost:3000/api/test-email?type=failure

### Expected Results
- **Without RESEND_API_KEY**: Console logs showing what would be sent
- **With RESEND_API_KEY**: Actual emails sent to your Clerk user email

### Troubleshooting
- If no emails arrive, check Resend dashboard → Logs
- In development, you can send to any email without domain verification
- Check browser console for response JSON

---

## ✅ Task 2: Customize Email Templates

### File to Edit: `app/lib/email.ts`

### Branding Customization Options

#### 1. Update Color Scheme
Find and replace these gradient colors in all email templates:

**Current colors:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Your brand colors (example):**
```css
/* Primary brand gradient */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);

/* Button color */
background: #YOUR_PRIMARY_COLOR;
```

#### 2. Update Logo/Header
Add your logo to email headers (in each `sendXxxEmail` function):

```html
<div class="header">
  <img src="https://yourdomain.com/logo.png" alt="Logo" style="height: 40px; margin-bottom: 10px;">
  <h1 style="margin: 0;">Your Custom Title</h1>
</div>
```

#### 3. Update Footer Information
Replace footer content with your company info:

```html
<div class="footer">
  <p>Your Company Name | Your Tagline</p>
  <p>123 Your Street, City, State 12345</p>
  <p><a href="${config.appUrl}/dashboard">Dashboard</a> | <a href="${config.appUrl}/unsubscribe">Unsubscribe</a></p>
</div>
```

#### 4. Customize Email Copy
Edit the email body text to match your brand voice:
- `sendWelcomeEmail` - First impression for new users
- `sendScanCompleteEmail` - Celebration of results
- `sendPaymentSuccessEmail` - Thank you message
- `sendScanFailedEmail` - Empathetic error message

### Quick Customization Script

Create a search-and-replace list:
```typescript
// In app/lib/email.ts
// Find: #667eea (primary purple)
// Replace: #YOUR_COLOR

// Find: PainPointRadar
// Replace: Your Brand Name

// Find: Discover your next SaaS idea from Reddit
// Replace: Your tagline here
```

---

## ✅ Task 3: Set Up Clerk Webhook (Welcome Emails)

### 1. Install Required Package
```bash
cd app
npm install svix
```

### 2. Update Webhook Handler
Uncomment the verification code in `app/api/webhooks/clerk/route.ts`:

```typescript
// Change this line:
// import { Webhook } from 'svix' // Uncomment after: npm install svix

// To:
import { Webhook } from 'svix'

// Remove the temporary type:
// type Webhook = any
```

Also uncomment the verification block in the same file.

### 3. Configure Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **Add Endpoint**
5. Enter endpoint URL:
   - **Development**: Use ngrok or similar tunnel
     ```bash
     npx ngrok http 3000
     # Use: https://your-id.ngrok.io/api/webhooks/clerk
     ```
   - **Production**: `https://yourdomain.com/api/webhooks/clerk`

6. Subscribe to events:
   - ✅ `user.created` (required for welcome emails)
   - Optionally: `user.updated`, `user.deleted`

7. Copy the **Signing Secret** (starts with `whsec_...`)

### 4. Add Webhook Secret to Environment
Add to `app/.env.local`:
```bash
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 5. Test the Webhook

**Option A: Create a test user**
1. Go to your sign-up page
2. Create a new account
3. Check your email for the welcome message

**Option B: Use Clerk dashboard**
1. Go to Clerk Dashboard → Webhooks
2. Select your webhook endpoint
3. Click **Testing** tab
4. Send a test `user.created` event

### 6. Verify Logs
Check your server logs for:
```
📧 Sending welcome email to new user: user@example.com
✅ Welcome email sent to user@example.com
```

---

## ✅ Task 4: Set Up Stripe Webhook (Payment Emails)

### 1. Check Existing Stripe Webhook
Look for existing webhook handler:
```bash
# Check if file exists
ls app/api/stripe/webhook/route.ts
```

### 2. Add Email Integration to Stripe Webhook

If the file exists, add this import at the top:
```typescript
import { sendPaymentSuccessEmail } from '@/lib/email'
import { clerkClient } from '@clerk/nextjs/server'
```

Then find the `checkout.session.completed` handler and add:
```typescript
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session
  
  // Existing code to update database...
  
  // Add email notification
  try {
    const userId = session.metadata?.userId
    if (userId) {
      const user = await clerkClient.users.getUser(userId)
      const userEmail = user.emailAddresses[0]?.emailAddress
      
      if (userEmail) {
        await sendPaymentSuccessEmail(userEmail, {
          userName: user.firstName || 'there',
          planName: session.metadata?.planName || 'Pro Plan',
          amount: session.amount_total || 0,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        })
        console.log(`✅ Payment confirmation email sent to ${userEmail}`)
      }
    }
  } catch (emailError) {
    console.error('❌ Failed to send payment email:', emailError)
    // Don't fail the webhook if email fails
  }
  break
}
```

### 3. Configure Stripe Webhook (if not already set up)

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter URL:
   - **Development**: Use Stripe CLI
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
   - **Production**: `https://yourdomain.com/api/stripe/webhook`

4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

5. Copy the **Signing secret** (starts with `whsec_...`)

### 4. Add to Environment
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 5. Test with Stripe CLI
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger a test event:
stripe trigger checkout.session.completed
```

---

## ✅ Task 5: Verify Domain (Production Only)

### When to Do This
- ✅ **Now**: If deploying to production
- ⏭️ **Later**: Fine for development (can send to your own email)

### Steps

1. **Go to Resend Dashboard**
   - Navigate to https://resend.com/domains

2. **Add Your Domain**
   - Click "Add Domain"
   - Enter your domain (e.g., `painpointradar.com`)
   - Choose verification method: DNS records

3. **Add DNS Records**
   
   Resend will provide 3 DNS records to add:
   
   **SPF Record:**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   ```
   
   **DKIM Records:**
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [provided by Resend]
   ```
   
   ```
   Type: CNAME
   Name: resend._domainkey
   Value: [provided by Resend]
   ```

4. **Add DNS Records to Your Provider**
   - Go to your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.)
   - Add the 3 records exactly as provided
   - Save changes

5. **Verify Domain in Resend**
   - Wait 5-10 minutes for DNS propagation
   - Click "Verify" in Resend dashboard
   - Status should change to "Verified" ✅

6. **Update Email From Address**
   
   Update `app/.env.local` (or production environment):
   ```bash
   # Before (development):
   EMAIL_FROM_ADDRESS="PainPointRadar <noreply@painpointradar.com>"
   
   # After (production with verified domain):
   EMAIL_FROM_ADDRESS="PainPointRadar <noreply@yourdomain.com>"
   ```

### Troubleshooting Domain Verification

**DNS not propagating:**
- Wait 24 hours (can take up to 48 hours)
- Check DNS with: `nslookup -type=TXT yourdomain.com`
- Use online tool: https://dnschecker.org

**Verification failed:**
- Double-check record values (no extra spaces)
- Ensure @ symbol is used for root domain records
- Contact your DNS provider support

**Emails still going to spam:**
- Add DMARC record (optional but recommended):
  ```
  Type: TXT
  Name: _dmarc
  Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
  ```
- Warm up your domain (start with low volume)
- Ask recipients to mark as "Not Spam"

---

## 📝 Quick Testing Checklist

### Before Production Launch

- [ ] All email templates tested with real API key
- [ ] Email templates customized with brand colors/logo
- [ ] Clerk webhook set up and tested (welcome emails sent)
- [ ] Stripe webhook integrated (payment emails sent)
- [ ] Domain verified in Resend (if production)
- [ ] DNS records added and verified
- [ ] Test emails received successfully (not in spam)
- [ ] Email copy reviewed for typos/errors
- [ ] Unsubscribe links added (if sending marketing emails)
- [ ] Privacy policy linked in footer

### Environment Variables Checklist

```bash
# Required for emails to work:
✅ RESEND_API_KEY
✅ EMAIL_FROM_ADDRESS

# Required for webhooks:
✅ CLERK_WEBHOOK_SECRET (for welcome emails)
✅ STRIPE_WEBHOOK_SECRET (for payment emails)

# Already configured:
✅ NEXT_PUBLIC_APP_URL (for email links)
✅ DATABASE_URL
✅ CLERK_SECRET_KEY
```

---

## 🚀 Deployment Checklist

### Update Production Environment Variables

1. **Vercel/Netlify/Railway Dashboard**
   - Add all environment variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to production domain
   - Update `EMAIL_FROM_ADDRESS` to verified domain

2. **Update Webhook URLs**
   - Clerk: Update endpoint URL to production domain
   - Stripe: Update endpoint URL to production domain

3. **Test Production Webhooks**
   - Create a test user in production
   - Process a test payment in production
   - Verify emails are received

### Monitor Email Delivery

1. **Resend Dashboard**
   - Check delivery rates
   - Monitor bounce rates
   - Review spam complaints

2. **Set Up Alerts**
   - Email failures > 5%
   - Bounce rate > 2%
   - Spam complaints > 0.1%

---

## 📚 Additional Resources

- **Resend Docs**: https://resend.com/docs
- **Clerk Webhooks**: https://clerk.com/docs/integration/webhooks
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Email Best Practices**: https://resend.com/docs/knowledge-base/best-practices

---

## ❓ Need Help?

Common issues and solutions in `app/EMAIL_SETUP.md` (full troubleshooting guide)

**Quick fixes:**
- Emails not sending → Check API key is set correctly
- Webhook not firing → Check signing secret and URL
- Emails in spam → Verify domain and add DMARC record
- Template broken → Validate HTML with online checker
