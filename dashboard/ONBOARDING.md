# PainPointRadar Onboarding Flow

## Overview
The onboarding flow is a streamlined, 5-step user journey that gets founders from signup to their first scan report in minutes. It's designed for **zero friction** and **maximum clarity**.

## The 5-Step Flow

### Step 1: Create Account
- **Options**: Email signup or GitHub OAuth
- **Time**: 30 seconds
- **Validation**: Email format check (for email signup)
- **Data Collected**: Authentication method, email (if applicable)

### Step 2: Choose Input Method
- **Options**: Enter a keyword OR select a subreddit
- **Validation**: At least one input required
- **Examples Provided**: "CRM", "student budgeting", "remote work"
- **Preloaded Subreddits**: SaaS, startups, Entrepreneur, webdev, business, freelance, productivity

### Step 3: Select Scan Type
- **Light Scan (FREE)**
  - ~50 posts analyzed
  - Limited daily scans
  - Instant results
- **Deep Scan ($9)**
  - ~500+ posts analyzed
  - Unlimited scans
  - Comprehensive market analysis
  - Competitor detection

### Step 4: Progress Tracking
- **Real-time status updates**:
  - Fetching posts...
  - Analyzing sentiment...
  - Clustering pain points...
  - Calculating scores...
  - Generating report...
  - Finalizing...
- **Animated progress circle** (0-100%)
- **Duration**: ~30-60 seconds

### Step 5: Download Report
- **Available Formats**:
  - CSV (spreadsheet)
  - XLSX (Excel)
  - HTML (interactive report with embedded charts)
- **Summary Stats**:
  - Posts analyzed
  - Pain points identified
  - Sentiment score
  - Market gap score

## Technical Implementation

### Files
- `dashboard/onboarding.html` - Complete self-contained onboarding UI
- `dashboard/index.html` - Landing page (links to onboarding)

### Features
- ✅ Fully client-side validation
- ✅ Responsive design (mobile-friendly)
- ✅ Smooth animations and transitions
- ✅ Progress indicator (visual dots)
- ✅ Error handling and user feedback
- ✅ Form state management in JavaScript
- ✅ Simulated progress bar (ready for backend integration)

### Styling
- Uses Elicit-inspired color scheme (blue/white/minimal)
- Sans-serif typography (system fonts)
- Generous whitespace
- Clear visual hierarchy
- Accessible form controls

## Integration with Backend

The onboarding UI is ready to integrate with your backend. Key touchpoints:

### Step 1: Authentication
```javascript
// Replace with actual auth endpoint
if (formData.authMethod === 'email') {
    // POST to /api/auth/signup
} else if (formData.authMethod === 'github') {
    // Redirect to GitHub OAuth flow
}
```

### Step 3→4: Initiate Scan
```javascript
// When user selects scan type and clicks "Continue"
// POST to /api/scans/create with:
{
    keyword: formData.keyword,
    subreddit: formData.subreddit,
    scanType: formData.scanType  // 'light' or 'deep'
}
```

### Step 4: Progress Updates
```javascript
// WebSocket or polling endpoint
// GET /api/scans/{scanId}/status
// Returns: { progress: 0-100, status: "...", eta: "..." }
```

### Step 5: Download
```javascript
// Replace downloadFile() with actual endpoints
// GET /api/scans/{scanId}/export?format=csv|xlsx|html
```

## User Experience Highlights

1. **Minimal Decisions** - Only 3 required choices (auth, search term, scan depth)
2. **Clear Progress** - Visual indicators show where they are
3. **Fast Feedback** - Errors appear immediately, no page reloads
4. **Mobile Optimized** - Single-column layout on mobile
5. **Accessible** - Form labels, semantic HTML, keyboard navigation
6. **Professional** - Matches Elicit's minimalist design language

## Copy & Messaging

- **Headline**: "Find real pain points. Build better SaaS."
- **Free Tier Messaging**: "Quick insights from top posts"
- **Paid Tier Messaging**: "Comprehensive market analysis"
- **CTA Text**: "Continue →" (implies simplicity)
- **Completion Message**: "✓ Scan Complete! Download and share with your team."

## Future Enhancements

- [ ] Real backend integration
- [ ] Payment gateway for Deep Scan
- [ ] WebSocket live progress updates
- [ ] Email report delivery
- [ ] Social sharing of results
- [ ] Comparison reports (before/after)
- [ ] API for programmatic access
- [ ] Saved scans history
- [ ] Team collaboration features

## Testing the Flow

1. Open `dashboard/onboarding.html` in a browser
2. Try all 5 steps:
   - Select email or GitHub
   - Enter a keyword (e.g., "CRM")
   - Choose Light or Deep scan
   - Watch progress bar
   - Download report (mock)
3. Click "New Scan" to restart

All interactions are fully functional in the current UI.
