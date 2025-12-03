/**
 * AI Service - Handles OpenAI and Claude API integrations
 * Provides unified interface for AI-powered analysis and generation
 */

import OpenAI from "openai"
import Anthropic from "@anthropic-ai/sdk"

// AI Provider type
export type AIProvider = "openai" | "claude" | "auto"

// AI Configuration
interface AIConfig {
  provider: AIProvider
  openaiApiKey?: string
  anthropicApiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

// Default configuration
const defaultConfig: AIConfig = {
  provider: (process.env.AI_PROVIDER as AIProvider) || "auto",
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.AI_MODEL,
  temperature: 0.7,
  maxTokens: 2000,
}

// Initialize clients
let openaiClient: OpenAI | null = null
let anthropicClient: Anthropic | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!defaultConfig.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables")
    }
    openaiClient = new OpenAI({
      apiKey: defaultConfig.openaiApiKey,
    })
  }
  return openaiClient
}

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!defaultConfig.anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables")
    }
    anthropicClient = new Anthropic({
      apiKey: defaultConfig.anthropicApiKey,
    })
  }
  return anthropicClient
}

/**
 * Determine which provider to use
 */
function determineProvider(config: Partial<AIConfig> = {}): "openai" | "claude" {
  const provider = config.provider || defaultConfig.provider

  if (provider === "openai") {
    if (!defaultConfig.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is required when provider is 'openai'")
    }
    return "openai"
  }

  if (provider === "claude") {
    if (!defaultConfig.anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is required when provider is 'claude'")
    }
    return "claude"
  }

  // Auto: prefer OpenAI if both are available, otherwise use what's available
  if (defaultConfig.openaiApiKey) {
    return "openai"
  }
  if (defaultConfig.anthropicApiKey) {
    return "claude"
  }

  throw new Error("No AI API keys configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY")
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  prompt: string,
  systemPrompt?: string,
  config: Partial<AIConfig> = {}
): Promise<string> {
  const client = getOpenAIClient()
  const model = config.model || defaultConfig.model || "gpt-4o-mini"

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
      temperature: config.temperature ?? defaultConfig.temperature,
      max_tokens: config.maxTokens ?? defaultConfig.maxTokens,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content returned from OpenAI")
    }

    return content
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message} (${error.status})`)
    }
    throw error
  }
}

/**
 * Call Claude API
 */
async function callClaude(
  prompt: string,
  systemPrompt?: string,
  config: Partial<AIConfig> = {}
): Promise<string> {
  const client = getAnthropicClient()
  const model = config.model || defaultConfig.model || "claude-3-5-sonnet-20241022"

  try {
    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: prompt,
      },
    ]

    const response = await client.messages.create({
      model,
      max_tokens: config.maxTokens ?? defaultConfig.maxTokens ?? 2000,
      temperature: config.temperature ?? defaultConfig.temperature,
      system: systemPrompt,
      messages,
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    return content.text
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error: ${error.message} (${error.status})`)
    }
    throw error
  }
}

/**
 * Unified AI call function with automatic provider selection and error handling
 */
export async function callAI(
  prompt: string,
  systemPrompt?: string,
  config: Partial<AIConfig> = {}
): Promise<string> {
  const provider = determineProvider(config)

  try {
    if (provider === "openai") {
      return await callOpenAI(prompt, systemPrompt, config)
    } else {
      return await callClaude(prompt, systemPrompt, config)
    }
  } catch (error) {
    // If primary provider fails and we're in auto mode, try fallback
    if (config.provider === "auto" || !config.provider) {
      const fallbackProvider = provider === "openai" ? "claude" : "openai"
      
      // Check if fallback is available
      if (
        (fallbackProvider === "openai" && defaultConfig.openaiApiKey) ||
        (fallbackProvider === "claude" && defaultConfig.anthropicApiKey)
      ) {
        console.warn(`Primary AI provider failed, trying fallback: ${fallbackProvider}`)
        try {
          if (fallbackProvider === "openai") {
            return await callOpenAI(prompt, systemPrompt, config)
          } else {
            return await callClaude(prompt, systemPrompt, config)
          }
        } catch (fallbackError) {
          throw new Error(
            `Both AI providers failed. Primary: ${error instanceof Error ? error.message : "unknown"}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : "unknown"}`
          )
        }
      }
    }

    throw error
  }
}

/**
 * Generate a better cluster name using AI
 */
export async function generateClusterName(
  items: Array<{ text: string; score: number }>,
  config: Partial<AIConfig> = {}
): Promise<string> {
  const sampleTexts = items
    .slice(0, 10)
    .map((item) => item.text.substring(0, 200))
    .join("\n\n---\n\n")

  const prompt = `Based on these Reddit discussions, generate a concise, descriptive name (2-4 words) for this pain point cluster. Focus on the core problem or need expressed.

Examples:
- "API Rate Limiting Issues"
- "Project Management Overhead"
- "Customer Support Delays"
- "Payment Processing Errors"

Discussions:
${sampleTexts}

Cluster name:`

  const systemPrompt = "You are an expert at identifying and naming pain points from user discussions. Generate concise, descriptive names that capture the essence of the problem."

  try {
    const name = await callAI(prompt, systemPrompt, {
      ...config,
      temperature: 0.5, // Lower temperature for more consistent naming
      maxTokens: 50,
    })

    // Clean up the response
    return name.trim().replace(/^["']|["']$/g, "").substring(0, 100)
  } catch (error) {
    console.error("Failed to generate cluster name with AI:", error)
    // Fallback to simple keyword extraction
    return "General Discussion"
  }
}

/**
 * Generate a detailed cluster description using AI
 */
export async function generateClusterDescription(
  clusterName: string,
  items: Array<{ text: string; score: number; sourceUrl?: string }>,
  config: Partial<AIConfig> = {}
): Promise<string> {
  const sampleTexts = items
    .slice(0, 15)
    .map((item, idx) => `[${idx + 1}] ${item.text.substring(0, 300)}`)
    .join("\n\n")

  const prompt = `Analyze these Reddit discussions about "${clusterName}" and write a comprehensive 2-3 sentence description that:
1. Summarizes the main pain points
2. Explains why this is a problem
3. Highlights the opportunity for a solution

Discussions:
${sampleTexts}

Description:`

  const systemPrompt =
    "You are a product analyst specializing in identifying market opportunities from user pain points. Write clear, concise descriptions that highlight business opportunities."

  try {
    const description = await callAI(prompt, systemPrompt, {
      ...config,
      temperature: 0.7,
      maxTokens: 300,
    })

    return description.trim()
  } catch (error) {
    console.error("Failed to generate cluster description with AI:", error)
    // Fallback description
    const itemCount = items.length
    const avgScore = items.reduce((sum, i) => sum + i.score, 0) / itemCount
    return `${itemCount} related discussions with an average engagement score of ${Math.round(avgScore)}. Users are discussing issues and experiences related to ${clusterName}.`
  }
}

/**
 * Generate solution ideas for a pain point cluster
 */
export interface SolutionIdea {
  productIdea: string
  features: string[]
  mvp: string
  pricingModel: string
  targetUsers: string
  marketingAngle: string
}

export async function generateSolutionIdeas(
  clusterName: string,
  description: string,
  items: Array<{ text: string; score: number }>,
  config: Partial<AIConfig> = {}
): Promise<SolutionIdea> {
  const sampleTexts = items
    .slice(0, 10)
    .map((item) => item.text.substring(0, 200))
    .join("\n\n---\n\n")

  const prompt = `Based on this pain point cluster, generate a comprehensive SaaS solution idea.

Cluster: ${clusterName}
Description: ${description}

Sample discussions:
${sampleTexts}

Generate a solution idea with:
1. Product idea (one sentence)
2. Key features (4-5 bullet points)
3. MVP concept (one sentence)
4. Pricing model (one sentence)
5. Target users (one sentence)
6. Marketing angle (one sentence)

Format your response as JSON:
{
  "productIdea": "...",
  "features": ["...", "..."],
  "mvp": "...",
  "pricingModel": "...",
  "targetUsers": "...",
  "marketingAngle": "..."
}`

  const systemPrompt =
    "You are a SaaS product strategist. Generate practical, actionable solution ideas based on user pain points. Focus on MVP-friendly, monetizable ideas."

  try {
    const response = await callAI(prompt, systemPrompt, {
      ...config,
      temperature: 0.8,
      maxTokens: 500,
    })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const solution = JSON.parse(jsonMatch[0]) as SolutionIdea
      
      // Validate and ensure all fields exist
      return {
        productIdea: solution.productIdea || "SaaS solution for this pain point",
        features: Array.isArray(solution.features) ? solution.features : [],
        mvp: solution.mvp || "MVP concept to be defined",
        pricingModel: solution.pricingModel || "Subscription-based pricing",
        targetUsers: solution.targetUsers || "Target users to be identified",
        marketingAngle: solution.marketingAngle || "Marketing strategy to be developed",
      }
    }

    throw new Error("No JSON found in AI response")
  } catch (error) {
    console.error("Failed to generate solution ideas with AI:", error)
    
    // Fallback solution
    return {
      productIdea: `SaaS platform to address ${clusterName}`,
      features: ["Core feature 1", "Core feature 2", "Analytics dashboard", "Integration support"],
      mvp: `MVP focused on solving the core ${clusterName} problem`,
      pricingModel: "Freemium model with paid tiers ($29-99/month)",
      targetUsers: "Users experiencing this pain point",
      marketingAngle: "Target relevant communities and forums",
    }
  }
}

/**
 * Enhance cluster analysis with AI insights
 */
export async function enhanceClusterAnalysis(
  clusterName: string,
  items: Array<{ text: string; score: number }>,
  config: Partial<AIConfig> = {}
): Promise<{
  name: string
  description: string
  solution?: SolutionIdea
}> {
  try {
    const [name, description] = await Promise.all([
      generateClusterName(items, config),
      generateClusterDescription(clusterName, items, config),
    ])

    return {
      name,
      description,
    }
  } catch (error) {
    console.error("Failed to enhance cluster analysis:", error)
    throw error
  }
}

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
  return !!(defaultConfig.openaiApiKey || defaultConfig.anthropicApiKey)
}

/**
 * Get current AI provider
 */
export function getCurrentProvider(): AIProvider | null {
  try {
    return determineProvider()
  } catch {
    return null
  }
}

