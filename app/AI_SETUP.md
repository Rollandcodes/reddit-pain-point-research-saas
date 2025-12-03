# AI Integration Setup

This application uses AI (OpenAI or Claude) to enhance pain point analysis with better cluster names, descriptions, and solution ideas.

## Supported Providers

- **OpenAI** (GPT-4, GPT-3.5, GPT-4o-mini)
- **Anthropic Claude** (Claude 3.5 Sonnet, Claude 3 Opus, etc.)
- **Auto mode**: Automatically selects available provider

## Setup

### 1. Get API Keys

**OpenAI:**
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Create an API key in your [API keys dashboard](https://platform.openai.com/api-keys)
3. Add billing information (required for API access)

**Anthropic Claude:**
1. Sign up at [Anthropic](https://www.anthropic.com/)
2. Create an API key in your [console](https://console.anthropic.com/)
3. Add billing information

### 2. Environment Variables

Add to your `.env.local`:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# OR Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Specify provider (auto, openai, claude)
AI_PROVIDER=auto

# Optional: Specify model
AI_MODEL=gpt-4o-mini  # or claude-3-5-sonnet-20241022
```

**Note:** You only need one API key. The system will use whichever is available. If both are set, it will prefer OpenAI in "auto" mode.

### 3. Recommended Models

**OpenAI:**
- `gpt-4o-mini` - Fast, cost-effective (recommended)
- `gpt-4o` - More capable, higher cost
- `gpt-3.5-turbo` - Legacy, cheaper

**Anthropic:**
- `claude-3-5-sonnet-20241022` - Balanced performance (recommended)
- `claude-3-opus-20240229` - Most capable, higher cost
- `claude-3-haiku-20240307` - Fastest, most cost-effective

## Features

### 1. Enhanced Cluster Names

AI generates more descriptive and accurate cluster names instead of simple keyword extraction.

**Before (keyword-based):**
- "Project Management Tools"

**After (AI-generated):**
- "Team Collaboration Workflow Bottlenecks"
- "Project Timeline Estimation Challenges"

### 2. Rich Cluster Descriptions

AI creates comprehensive descriptions that explain:
- The main pain points
- Why it's a problem
- The business opportunity

**Example:**
> "Users are struggling with fragmented communication across multiple tools, leading to missed deadlines and context loss. This represents a significant opportunity for a unified collaboration platform that reduces tool-switching overhead."

### 3. Solution Ideas Generation

Generate actionable SaaS solution ideas for any cluster via API:

```bash
POST /api/clusters/{clusterId}/solutions
```

Returns:
```json
{
  "success": true,
  "solution": {
    "productIdea": "Unified team collaboration platform",
    "features": [
      "Real-time messaging",
      "Task management",
      "File sharing",
      "Video calls",
      "Calendar integration"
    ],
    "mvp": "Slack-like messaging with integrated task boards",
    "pricingModel": "Freemium: $0 for teams <10, $9/user/month for pro",
    "targetUsers": "Remote teams, startups, agencies managing multiple clients",
    "marketingAngle": "One tool instead of five: consolidate your team stack"
  }
}
```

## Usage

### Automatic Integration

AI is automatically used when:
1. Clusters are generated during scan processing
2. API keys are configured
3. AI service is available

The system gracefully falls back to keyword-based methods if AI is unavailable.

### Manual Solution Generation

Generate solutions for a specific cluster:

```typescript
import { generateSolutionIdeas } from "@/lib/ai"

const solution = await generateSolutionIdeas(
  "Team Collaboration Issues",
  "Users struggle with tool fragmentation...",
  items
)
```

### Check AI Availability

```typescript
import { isAIAvailable, getCurrentProvider } from "@/lib/ai"

if (isAIAvailable()) {
  console.log(`AI provider: ${getCurrentProvider()}`)
}
```

## Error Handling

The AI service includes comprehensive error handling:

1. **Automatic Fallback**: If primary provider fails, automatically tries the other (in auto mode)
2. **Graceful Degradation**: Falls back to keyword-based methods if AI fails
3. **Error Logging**: All errors are logged for debugging
4. **User-Friendly Messages**: Clear error messages returned to API consumers

## Cost Considerations

### OpenAI Pricing (as of 2024)
- `gpt-4o-mini`: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- `gpt-4o`: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens

### Anthropic Pricing (as of 2024)
- `claude-3-5-sonnet`: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- `claude-3-haiku`: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens

### Estimated Costs per Scan

For a typical scan with 20 clusters:
- **With gpt-4o-mini**: ~$0.02-0.05 per scan
- **With claude-3-5-sonnet**: ~$0.10-0.20 per scan

**Tips to reduce costs:**
- Use `gpt-4o-mini` or `claude-3-haiku` for cost-effective analysis
- Limit cluster count (already capped at 20)
- Cache AI responses for similar clusters
- Use AI only for top clusters (highest opportunity scores)

## Rate Limits

### OpenAI
- Tier 1: 500 requests/minute
- Tier 2: 5,000 requests/minute
- Higher tiers available

### Anthropic
- Standard: 50 requests/minute
- Higher limits available on request

The system includes automatic retry logic with exponential backoff.

## Testing

### Test AI Integration

1. **Check if AI is available:**
   ```bash
   curl http://localhost:3000/api/health
   # Should show AI status
   ```

2. **Create a test scan:**
   - Use the UI to create a scan
   - Check worker logs for AI usage
   - Verify cluster descriptions are AI-generated

3. **Generate a solution:**
   ```bash
   curl -X POST http://localhost:3000/api/clusters/{clusterId}/solutions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Troubleshooting

### AI not being used

1. **Check environment variables:**
   ```bash
   echo $OPENAI_API_KEY
   echo $ANTHROPIC_API_KEY
   ```

2. **Check config:**
   ```typescript
   import { config } from "@/lib/config"
   console.log(config.ai.enabled) // Should be true
   ```

3. **Check logs:**
   - Look for "AI cluster name generation failed" warnings
   - Check for API key errors

### API Errors

**"API key invalid":**
- Verify API key is correct
- Check for extra spaces or quotes
- Ensure billing is set up

**"Rate limit exceeded":**
- Reduce scan frequency
- Upgrade API tier
- Add retry delays

**"Model not found":**
- Check model name spelling
- Verify model is available in your region
- Use a supported model

## Advanced Configuration

### Custom Model Selection

```env
AI_MODEL=gpt-4o  # Use GPT-4o instead of default
```

### Provider-Specific Settings

```env
AI_PROVIDER=claude  # Force Claude even if OpenAI is available
```

### Temperature Control

Modify in `app/lib/ai.ts`:
- Lower temperature (0.3-0.5): More consistent, less creative
- Higher temperature (0.8-1.0): More creative, less consistent

## Future Enhancements

- [ ] Batch processing for multiple clusters
- [ ] Caching AI responses
- [ ] Custom prompts per use case
- [ ] Multi-language support
- [ ] Fine-tuned models for pain point analysis
- [ ] Cost tracking and budgeting

