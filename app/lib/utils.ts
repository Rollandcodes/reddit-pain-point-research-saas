import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Convert sentiment score (-1 to 1) to label
 */
export function sentimentLabel(score: number): 'negative' | 'neutral' | 'positive' {
  if (score < -0.2) return 'negative'
  if (score > 0.2) return 'positive'
  return 'neutral'
}

/**
 * Get color class for sentiment
 */
export function sentimentColor(score: number): string {
  const label = sentimentLabel(score)
  switch (label) {
    case 'negative': return 'text-red-600'
    case 'positive': return 'text-green-600'
    default: return 'text-gray-600'
  }
}

/**
 * Get color class for opportunity score
 */
export function opportunityColor(score: number): string {
  if (score >= 80) return 'text-green-600 bg-green-50'
  if (score >= 60) return 'text-yellow-600 bg-yellow-50'
  if (score >= 40) return 'text-orange-600 bg-orange-50'
  return 'text-gray-600 bg-gray-50'
}
