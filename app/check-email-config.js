#!/usr/bin/env node

/**
 * Email Configuration Status Checker
 * Quickly verify your email setup is complete
 * 
 * Usage: node check-email-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║  📧 Email Configuration Status Checker                    ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const envPath = path.join(__dirname, '.env.local');
const emailFilePath = path.join(__dirname, 'lib', 'email.ts');
const clerkWebhookPath = path.join(__dirname, 'app', 'api', 'webhooks', 'clerk', 'route.ts');
const stripeWebhookPath = path.join(__dirname, 'app', 'api', 'stripe', 'webhook', 'route.ts');

let allGood = true;

// Check .env.local exists
console.log('📝 Configuration Files:\n');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env.local exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check RESEND_API_KEY
  const hasResendKey = envContent.includes('RESEND_API_KEY=re_') && !envContent.includes('RESEND_API_KEY=re_xxx');
  console.log(`   ${hasResendKey ? '✅' : '⚠️ '} RESEND_API_KEY ${hasResendKey ? 'configured' : 'not set or placeholder'}`);
  if (!hasResendKey) allGood = false;
  
  // Check EMAIL_FROM_ADDRESS
  const hasFromAddress = envContent.includes('EMAIL_FROM_ADDRESS=') && !envContent.includes('noreply@painpointradar.com');
  console.log(`   ${hasFromAddress ? '✅' : '⚠️ '} EMAIL_FROM_ADDRESS ${hasFromAddress ? 'customized' : 'using default'}`);
  
  // Check CLERK_WEBHOOK_SECRET
  const hasClerkSecret = envContent.includes('CLERK_WEBHOOK_SECRET=whsec_') && !envContent.includes('CLERK_WEBHOOK_SECRET=whsec_xxx');
  console.log(`   ${hasClerkSecret ? '✅' : '⏭️ '} CLERK_WEBHOOK_SECRET ${hasClerkSecret ? 'configured' : 'not set (optional)'}`);
  
  // Check STRIPE_WEBHOOK_SECRET  
  const hasStripeSecret = envContent.includes('STRIPE_WEBHOOK_SECRET=whsec_') && !envContent.includes('STRIPE_WEBHOOK_SECRET=whsec_xxx');
  console.log(`   ${hasStripeSecret ? '✅' : '⏭️ '} STRIPE_WEBHOOK_SECRET ${hasStripeSecret ? 'configured' : 'not set (optional)'}`);
  
} else {
  console.log('   ❌ .env.local not found');
  console.log('      → Run: node setup-email.js');
  allGood = false;
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check email templates
console.log('📧 Email Templates:\n');
if (fs.existsSync(emailFilePath)) {
  console.log('   ✅ lib/email.ts exists');
  
  const emailContent = fs.readFileSync(emailFilePath, 'utf8');
  
  // Check if colors have been customized
  const hasDefaultColors = emailContent.includes('#667eea') && emailContent.includes('#764ba2');
  console.log(`   ${!hasDefaultColors ? '✅' : '⏭️ '} Brand colors ${!hasDefaultColors ? 'customized' : 'using defaults (optional)'}`);
  
  // Count email functions
  const emailFunctions = [
    'sendWelcomeEmail',
    'sendScanCompleteEmail',
    'sendPaymentSuccessEmail',
    'sendScanFailedEmail'
  ];
  
  const functionsFound = emailFunctions.filter(fn => emailContent.includes(`export async function ${fn}`));
  console.log(`   ✅ ${functionsFound.length}/4 email templates available`);
  
} else {
  console.log('   ❌ lib/email.ts not found');
  allGood = false;
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check webhook integrations
console.log('🔗 Webhook Integrations:\n');

// Clerk webhook
if (fs.existsSync(clerkWebhookPath)) {
  const clerkContent = fs.readFileSync(clerkWebhookPath, 'utf8');
  const hasImport = clerkContent.includes('import { sendWelcomeEmail }');
  const hasVerification = clerkContent.includes('wh.verify(body');
  
  console.log('   ✅ Clerk webhook file exists');
  console.log(`   ${hasImport ? '✅' : '❌'} Welcome email imported`);
  console.log(`   ${hasVerification ? '⏭️ ' : '⚠️ '} Signature verification ${hasVerification ? 'enabled' : 'commented out (needs svix package)'}`);
} else {
  console.log('   ❌ Clerk webhook not found');
}

// Stripe webhook
if (fs.existsSync(stripeWebhookPath)) {
  const stripeContent = fs.readFileSync(stripeWebhookPath, 'utf8');
  const hasImport = stripeContent.includes('import { sendPaymentSuccessEmail }');
  const hasIntegration = stripeContent.includes('sendPaymentSuccessEmail(userEmail');
  
  console.log('   ✅ Stripe webhook file exists');
  console.log(`   ${hasImport ? '✅' : '❌'} Payment email imported`);
  console.log(`   ${hasIntegration ? '✅' : '❌'} Email sending integrated`);
} else {
  console.log('   ❌ Stripe webhook not found');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Overall status
console.log('📊 Overall Status:\n');

if (allGood && fs.existsSync(envPath)) {
  console.log('   ✅ Email system is configured and ready!');
  console.log('\n   Next steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Test emails: http://localhost:3000/api/test-email?type=welcome');
  console.log('   3. Customize if needed: node customize-emails.js\n');
} else {
  console.log('   ⚠️  Setup incomplete. Follow these steps:\n');
  
  if (!fs.existsSync(envPath)) {
    console.log('   1. Run: node setup-email.js');
    console.log('      OR manually create .env.local');
  } else {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasResendKey = envContent.includes('RESEND_API_KEY=re_') && !envContent.includes('RESEND_API_KEY=re_xxx');
    
    if (!hasResendKey) {
      console.log('   1. Get Resend API key: https://resend.com');
      console.log('   2. Add to .env.local: RESEND_API_KEY=re_xxxxx');
    }
  }
  
  console.log('\n   📚 See EMAIL_README.md for complete setup guide\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Optional features status
console.log('📌 Optional Features:\n');
console.log('   ⏭️  Brand customization: node customize-emails.js');
console.log('   ⏭️  Clerk webhook: Follow EMAIL_IMPLEMENTATION_CHECKLIST.md');
console.log('   ⏭️  Domain verification: For production only');
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

process.exit(allGood ? 0 : 1);
