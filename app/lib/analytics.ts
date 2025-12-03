/**
 * Analytics module - tracks key events
 * Currently logs to console, can be swapped for a real provider later
 */

type EventName = 
  | 'waitlist_signup_submitted'
  | 'scan_created'
  | 'scan_completed'
  | 'scan_failed'
  | 'sample_report_viewed'
  | 'cluster_viewed'
  | 'export_csv'
  | 'page_view'

interface EventData {
  [key: string]: string | number | boolean | undefined
}

class Analytics {
  private isEnabled: boolean

  constructor() {
    this.isEnabled = typeof window !== 'undefined'
  }

  /**
   * Track an event with optional metadata
   */
  track(eventName: EventName, data?: EventData): void {
    if (!this.isEnabled) return

    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...data,
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event)
    }

    // TODO: Send to analytics provider (Mixpanel, Amplitude, PostHog, etc.)
    // Example:
    // if (typeof window.posthog !== 'undefined') {
    //   window.posthog.capture(eventName, data)
    // }
  }

  /**
   * Track a page view
   */
  pageView(pageName: string): void {
    this.track('page_view', { page: pageName })
  }

  /**
   * Identify a user (after login)
   */
  identify(userId: string, traits?: EventData): void {
    if (!this.isEnabled) return

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Identify:', { userId, traits })
    }

    // TODO: Send to analytics provider
  }
}

export const analytics = new Analytics()

/**
 * Server-side analytics logging to database
 */
export async function trackServerEvent(
  eventName: EventName,
  userId?: string,
  metadata?: EventData
): Promise<void> {
  try {
    // Dynamic import to avoid issues in edge runtime
    const { prisma } = await import('./db')
    
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        userId,
        metadata: metadata as any,
      },
    })
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error)
  }
}
