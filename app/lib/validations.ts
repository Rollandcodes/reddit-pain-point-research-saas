import { z } from 'zod'

/**
 * Waitlist signup validation
 */
export const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['indie_founder', 'product_manager', 'agency', 'other'], {
    required_error: 'Please select your role',
  }),
  useCase: z.string().max(500, 'Use case must be 500 characters or less').optional(),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

/**
 * Scan creation validation
 */
export const scanSchema = z.object({
  keywords: z
    .string()
    .min(2, 'Keywords must be at least 2 characters')
    .max(200, 'Keywords must be 200 characters or less'),
  subreddits: z
    .string()
    .max(500, 'Subreddits must be 500 characters or less')
    .optional()
    .transform((val) => val?.trim() || undefined),
  timeRange: z.enum(['7', '30', '90'], {
    required_error: 'Please select a time range',
  }),
})

export type ScanInput = z.infer<typeof scanSchema>

/**
 * Rate limiting constants
 */
export const RATE_LIMITS = {
  SCANS_PER_DAY: 10,
  WAITLIST_PER_HOUR: 5,
  MAX_KEYWORDS_LENGTH: 200,
  MAX_SUBREDDITS: 10,
} as const
