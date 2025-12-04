#!/usr/bin/env node

/**
 * Email Setup Helper Script
 * Helps you configure email notifications step by step
 * 
 * Usage: node setup-email.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  📧 Email Notifications Setup Helper                      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const envPath = path.join(__dirname, '.env.local');
  const examplePath = path.join(__dirname, '.env.example');

  // Check if .env.local exists
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.log('📝 Creating .env.local from .env.example...\n');
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log('✅ Created .env.local\n');
    } else {
      console.log('⚠️  .env.example not found. Creating new .env.local...\n');
      fs.writeFileSync(envPath, '# Email Configuration\n');
    }
  }

  console.log('Let\'s configure your email settings!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 1: Resend API Key
  console.log('📨 Step 1: Resend API Key\n');
  console.log('   1. Go to https://resend.com');
  console.log('   2. Sign up for free (100 emails/day)');
  console.log('   3. Copy your API key from the dashboard\n');
  
  const apiKey = await question('   Enter your Resend API key (starts with "re_"): ');
  
  if (!apiKey.trim()) {
    console.log('   ⏭️  Skipping - you can add this later to .env.local');
  } else if (!apiKey.startsWith('re_')) {
    console.log('   ⚠️  Warning: API key should start with "re_"');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 2: From Address
  console.log('📧 Step 2: From Email Address\n');
  console.log('   Format: "Your Brand <noreply@yourdomain.com>"\n');
  
  const brandName = await question('   Enter your brand name (default: PainPointRadar): ');
  const emailDomain = await question('   Enter your domain (default: painpointradar.com): ');
  
  const finalBrandName = brandName.trim() || 'PainPointRadar';
  const finalDomain = emailDomain.trim() || 'painpointradar.com';
  const fromAddress = `${finalBrandName} <noreply@${finalDomain}>`;

  console.log(`\n   ✅ From address: "${fromAddress}"`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 3: Webhooks
  console.log('🔗 Step 3: Webhook Secrets (Optional)\n');
  console.log('   These are needed for automatic welcome & payment emails.\n');
  
  const setupWebhooks = await question('   Set up webhook secrets now? (y/n): ');

  let clerkSecret = '';
  let stripeSecret = '';

  if (setupWebhooks.toLowerCase() === 'y') {
    console.log('\n   📝 Clerk Webhook Secret:');
    console.log('      1. Go to https://dashboard.clerk.com');
    console.log('      2. Navigate to Webhooks');
    console.log('      3. Copy the signing secret (starts with "whsec_")\n');
    
    clerkSecret = await question('      Enter Clerk webhook secret (or press Enter to skip): ');

    console.log('\n   💳 Stripe Webhook Secret:');
    console.log('      1. Go to https://dashboard.stripe.com/webhooks');
    console.log('      2. Select your webhook endpoint');
    console.log('      3. Copy the signing secret (starts with "whsec_")\n');
    
    stripeSecret = await question('      Enter Stripe webhook secret (or press Enter to skip): ');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Read existing .env.local
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Update or add email configuration
  const emailSection = `
# ============================================
# Email Configuration (Resend)
# ============================================
RESEND_API_KEY=${apiKey.trim() || 're_xxxxxxxxxxxxxxxxxxxxx'}
EMAIL_FROM_ADDRESS="${fromAddress}"
${clerkSecret.trim() ? `CLERK_WEBHOOK_SECRET=${clerkSecret.trim()}` : '# CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx'}
${stripeSecret.trim() ? `STRIPE_WEBHOOK_SECRET=${stripeSecret.trim()}` : '# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx'}
`;

  // Remove old email section if exists
  envContent = envContent.replace(/# ============================================\n# Email Configuration.*?\n# ============================================\n.*?(?=\n\n|\n#|$)/s, '');
  
  // Append new email section
  envContent = envContent.trim() + '\n' + emailSection;

  // Write back
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Configuration saved to .env.local\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Summary
  console.log('📋 Setup Summary:\n');
  console.log(`   ✅ Resend API Key: ${apiKey ? '✓ Configured' : '⏭️  Skipped'}`);
  console.log(`   ✅ From Address: "${fromAddress}"`);
  console.log(`   ${clerkSecret ? '✅' : '⏭️ '} Clerk Webhook: ${clerkSecret ? '✓ Configured' : 'Not configured'}`);
  console.log(`   ${stripeSecret ? '✅' : '⏭️ '} Stripe Webhook: ${stripeSecret ? '✓ Configured' : 'Not configured'}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Next steps
  console.log('🚀 Next Steps:\n');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Test emails: http://localhost:3000/api/test-email?type=welcome');
  console.log('   3. Customize templates: node customize-emails.js');
  console.log('   4. Read docs: EMAIL_IMPLEMENTATION_CHECKLIST.md\n');

  if (!apiKey.trim()) {
    console.log('   ⚠️  Note: Without RESEND_API_KEY, emails will only log to console');
  }

  if (setupWebhooks.toLowerCase() === 'y' && (!clerkSecret.trim() || !stripeSecret.trim())) {
    console.log('   ⚠️  Note: Complete webhook setup to enable automatic emails');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✨ Email setup complete! Happy sending! 📧\n');

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
