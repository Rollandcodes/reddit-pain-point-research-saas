#!/usr/bin/env node

/**
 * Email Template Customization Helper
 * 
 * This script helps you quickly update brand colors across all email templates.
 * 
 * Usage:
 *   node customize-emails.js --primary "#YOUR_COLOR" --secondary "#YOUR_COLOR2"
 * 
 * Or edit the BRAND_CONFIG below and run:
 *   node customize-emails.js
 */

const fs = require('fs');
const path = require('path');

// ========================================
// CUSTOMIZE YOUR BRAND COLORS HERE
// ========================================
const BRAND_CONFIG = {
  // Email header gradient
  primaryColor: '#667eea',    // Change this to your brand color
  secondaryColor: '#764ba2',  // Change this to your secondary color
  
  // Button color
  buttonColor: '#667eea',     // Usually same as primary
  
  // Your brand name
  brandName: 'PainPointRadar',
  
  // Your tagline
  tagline: 'Discover your next SaaS idea from Reddit',
  
  // Your logo URL (optional)
  logoUrl: '', // e.g., 'https://yourdomain.com/logo.png'
};

// ========================================
// Script logic (don't edit below)
// ========================================

const emailFilePath = path.join(__dirname, 'lib', 'email.ts');

function updateEmailTemplates(config) {
  console.log('📧 Updating email templates...\n');
  
  if (!fs.existsSync(emailFilePath)) {
    console.error('❌ Error: email.ts not found at', emailFilePath);
    process.exit(1);
  }
  
  let content = fs.readFileSync(emailFilePath, 'utf8');
  let changesMade = false;
  
  // Update gradient colors
  const oldGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const newGradient = `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`;
  
  if (content.includes(oldGradient)) {
    content = content.replace(new RegExp(oldGradient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newGradient);
    console.log('✅ Updated header gradient colors');
    changesMade = true;
  }
  
  // Update button colors
  const oldButton = 'background: #667eea;';
  const newButton = `background: ${config.buttonColor};`;
  
  if (content.includes(oldButton)) {
    content = content.replace(new RegExp(oldButton.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newButton);
    console.log('✅ Updated button colors');
    changesMade = true;
  }
  
  // Update success gradient (green) for payment email
  const oldSuccessGradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  if (content.includes(oldSuccessGradient)) {
    console.log('ℹ️  Kept success email green gradient (recommended)');
  }
  
  // Update error gradient (red) for failure email
  const oldErrorGradient = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  if (content.includes(oldErrorGradient)) {
    console.log('ℹ️  Kept failure email red gradient (recommended)');
  }
  
  if (changesMade) {
    // Create backup
    const backupPath = emailFilePath + '.backup';
    fs.copyFileSync(emailFilePath, backupPath);
    console.log('💾 Created backup at', backupPath);
    
    // Write updated content
    fs.writeFileSync(emailFilePath, content, 'utf8');
    console.log('\n✨ Email templates updated successfully!');
    console.log('\nNext steps:');
    console.log('1. Review changes in lib/email.ts');
    console.log('2. Test emails: npm run dev → http://localhost:3000/api/test-email');
    console.log('3. If you need to revert: mv lib/email.ts.backup lib/email.ts');
  } else {
    console.log('ℹ️  No changes needed - colors already up to date');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Email Template Customization Helper

Usage:
  node customize-emails.js [options]

Options:
  --primary COLOR      Set primary brand color (e.g., "#3B82F6")
  --secondary COLOR    Set secondary brand color (e.g., "#8B5CF6")
  --button COLOR       Set button color (usually same as primary)
  --help, -h          Show this help message

Examples:
  node customize-emails.js --primary "#3B82F6" --secondary "#8B5CF6"
  node customize-emails.js --primary "#10B981"

Or edit BRAND_CONFIG in this file and run:
  node customize-emails.js
`);
  process.exit(0);
}

// Override config with command line args
const config = { ...BRAND_CONFIG };

for (let i = 0; i < args.length; i += 2) {
  const flag = args[i];
  const value = args[i + 1];
  
  if (flag === '--primary') config.primaryColor = value;
  if (flag === '--secondary') config.secondaryColor = value;
  if (flag === '--button') config.buttonColor = value;
}

console.log('🎨 Brand Configuration:');
console.log('  Primary:', config.primaryColor);
console.log('  Secondary:', config.secondaryColor);
console.log('  Button:', config.buttonColor);
console.log('');

updateEmailTemplates(config);
