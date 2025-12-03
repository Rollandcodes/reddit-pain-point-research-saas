/**
 * Configuration module - validates required environment variables at startup
 */

function getEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name]
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || ''
}

export const config = {
  // Database
  databaseUrl: getEnvVar('DATABASE_URL'),
  
  // Clerk Auth
  clerk: {
    publishableKey: getEnvVar('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
    secretKey: getEnvVar('CLERK_SECRET_KEY'),
  },
  
  // Reddit API
  reddit: {
    clientId: getEnvVar('REDDIT_CLIENT_ID', false),
    clientSecret: getEnvVar('REDDIT_CLIENT_SECRET', false),
    userAgent: getEnvVar('REDDIT_USER_AGENT', false) || 'PainPointRadar/1.0',
  },
  
  // App
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Feature flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const

export type Config = typeof config
