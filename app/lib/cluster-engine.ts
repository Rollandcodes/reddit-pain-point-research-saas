/**
 * Cluster Engine - Groups similar pain points together
 * Uses keyword similarity and basic NLP for clustering
 * Designed to be pluggable for future LLM-based clustering
 */

import type { RedditPost, RedditComment } from "./reddit-client"

interface TextItem {
  id: string
  text: string
  source: "post" | "comment"
  sourceUrl: string
  score: number
}

interface PainPointCluster {
  name: string
  description: string
  items: TextItem[]
  sentiment: number // -1 to 1
  opportunityScore: number // 0 to 100
}

// Common pain point indicator words
const PAIN_INDICATORS = [
  "frustrated", "annoying", "hate", "wish", "problem", "issue", "difficult",
  "hard to", "can't", "cannot", "won't", "doesn't work", "broken", "bug",
  "help", "need", "want", "looking for", "anyone know", "how do i",
  "struggle", "pain", "terrible", "awful", "worst", "sucks", "impossible",
  "confusing", "complicated", "expensive", "slow", "unreliable", "missing",
]

// Positive sentiment words (for sentiment analysis)
const POSITIVE_WORDS = [
  "love", "great", "awesome", "amazing", "perfect", "excellent", "best",
  "helpful", "easy", "simple", "fast", "reliable", "recommend", "works",
]

// Negative sentiment words
const NEGATIVE_WORDS = [
  "hate", "terrible", "awful", "worst", "bad", "horrible", "frustrating",
  "annoying", "broken", "useless", "waste", "disappointed", "regret",
]

/**
 * Extract relevant text items from Reddit posts and comments
 */
function extractTextItems(
  posts: RedditPost[],
  comments: RedditComment[]
): TextItem[] {
  const items: TextItem[] = []

  // Extract from posts
  for (const post of posts) {
    const text = `${post.title} ${post.selftext}`.trim()
    if (text.length > 20) {
      items.push({
        id: `post_${post.id}`,
        text,
        source: "post",
        sourceUrl: post.permalink,
        score: post.score,
      })
    }
  }

  // Extract from comments
  for (const comment of comments) {
    if (comment.body.length > 20 && comment.body.length < 2000) {
      items.push({
        id: `comment_${comment.id}`,
        text: comment.body,
        source: "comment",
        sourceUrl: comment.permalink,
        score: comment.score,
      })
    }
  }

  return items
}

/**
 * Score text for pain point indicators
 */
function scorePainIndicators(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 0

  for (const indicator of PAIN_INDICATORS) {
    if (lowerText.includes(indicator)) {
      score += 1
    }
  }

  return score
}

/**
 * Calculate sentiment score (-1 to 1)
 */
function calculateSentiment(text: string): number {
  const lowerText = text.toLowerCase()
  let positiveCount = 0
  let negativeCount = 0

  for (const word of POSITIVE_WORDS) {
    if (lowerText.includes(word)) positiveCount++
  }

  for (const word of NEGATIVE_WORDS) {
    if (lowerText.includes(word)) negativeCount++
  }

  const total = positiveCount + negativeCount
  if (total === 0) return 0

  return (positiveCount - negativeCount) / total
}

/**
 * Extract keywords from text (simple approach)
 */
function extractKeywords(text: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "can", "this", "that",
    "these", "those", "i", "you", "he", "she", "it", "we", "they", "my",
    "your", "his", "her", "its", "our", "their", "what", "which", "who",
    "when", "where", "why", "how", "all", "each", "every", "both", "few",
    "more", "most", "other", "some", "such", "no", "nor", "not", "only",
    "own", "same", "so", "than", "too", "very", "just", "about", "into",
    "through", "during", "before", "after", "above", "below", "between",
    "under", "again", "further", "then", "once", "here", "there", "any",
  ])

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))

  // Count word frequency
  const wordCount: Record<string, number> = {}
  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1
  }

  // Return top keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
}

/**
 * Calculate similarity between two sets of keywords
 */
function keywordSimilarity(keywords1: string[], keywords2: string[]): number {
  const set1 = new Set(keywords1)
  const set2 = new Set(keywords2)
  
  let intersection = 0
  for (const word of set1) {
    if (set2.has(word)) intersection++
  }

  const union = new Set([...set1, ...set2]).size
  return union > 0 ? intersection / union : 0
}

/**
 * Simple clustering using keyword similarity
 */
function clusterByKeywords(
  items: TextItem[],
  threshold = 0.3
): Map<number, TextItem[]> {
  const clusters = new Map<number, TextItem[]>()
  const itemKeywords = items.map(item => extractKeywords(item.text))
  const assigned = new Set<number>()
  let clusterIndex = 0

  for (let i = 0; i < items.length; i++) {
    if (assigned.has(i)) continue

    const cluster = [items[i]]
    assigned.add(i)

    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(j)) continue

      const similarity = keywordSimilarity(itemKeywords[i], itemKeywords[j])
      if (similarity >= threshold) {
        cluster.push(items[j])
        assigned.add(j)
      }
    }

    if (cluster.length >= 2) {
      clusters.set(clusterIndex++, cluster)
    }
  }

  return clusters
}

/**
 * Generate a descriptive name for a cluster
 */
function generateClusterName(items: TextItem[]): string {
  // Combine all text and extract top keywords
  const combinedText = items.map(i => i.text).join(" ")
  const keywords = extractKeywords(combinedText).slice(0, 3)
  
  if (keywords.length === 0) return "General Discussion"
  
  // Capitalize and join
  return keywords
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" & ")
}

/**
 * Generate a description for a cluster
 */
function generateClusterDescription(items: TextItem[]): string {
  const itemCount = items.length
  const avgScore = items.reduce((sum, i) => sum + i.score, 0) / itemCount
  
  return `${itemCount} related discussions with an average engagement score of ${Math.round(avgScore)}. Users are discussing issues and experiences related to this topic.`
}

/**
 * Calculate opportunity score (0-100)
 * Based on: frequency, negativity, engagement
 */
function calculateOpportunityScore(items: TextItem[], avgSentiment: number): number {
  const count = items.length
  const avgEngagement = items.reduce((sum, i) => sum + i.score, 0) / count
  
  // More items = higher opportunity (max 40 points)
  const countScore = Math.min(count / 5, 1) * 40
  
  // More negative = higher opportunity (max 30 points)
  const sentimentScore = ((1 - avgSentiment) / 2) * 30
  
  // Higher engagement = higher opportunity (max 30 points)
  const engagementScore = Math.min(Math.log10(avgEngagement + 1) / 3, 1) * 30
  
  return Math.round(countScore + sentimentScore + engagementScore)
}

/**
 * Main clustering function
 */
export async function clusterPainPoints(
  posts: RedditPost[],
  comments: RedditComment[]
): Promise<PainPointCluster[]> {
  // Extract text items
  const allItems = extractTextItems(posts, comments)
  
  // Filter to items with pain indicators
  const painItems = allItems
    .map(item => ({
      item,
      painScore: scorePainIndicators(item.text),
    }))
    .filter(({ painScore }) => painScore > 0)
    .sort((a, b) => b.painScore - a.painScore)
    .map(({ item }) => item)

  // Cluster by keyword similarity
  const rawClusters = clusterByKeywords(painItems)

  // Build final clusters
  const clusters: PainPointCluster[] = []

  for (const [, items] of rawClusters) {
    const sentiments = items.map(i => calculateSentiment(i.text))
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length

    clusters.push({
      name: generateClusterName(items),
      description: generateClusterDescription(items),
      items,
      sentiment: avgSentiment,
      opportunityScore: calculateOpportunityScore(items, avgSentiment),
    })
  }

  // Sort by opportunity score
  clusters.sort((a, b) => b.opportunityScore - a.opportunityScore)

  return clusters.slice(0, 20) // Return top 20 clusters
}

export type { TextItem, PainPointCluster }
