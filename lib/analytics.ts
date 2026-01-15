// Extend Window interface for analytics
declare global {
  interface Window {
    trackEvent?: (eventName: string, properties?: Record<string, any>) => void
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void
    gtag?: (...args: any[]) => void
    posthog?: {
      capture: (eventName: string, properties?: Record<string, any>) => void
    }
  }
}

// Simple analytics tracking
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window === 'undefined') return

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }

  // In production, integrate with your analytics provider
  // Examples:
  // - Plausible: window.plausible?.(eventName, { props: properties })
  // - Google Analytics: window.gtag?.('event', eventName, properties)
  // - PostHog: window.posthog?.capture(eventName, properties)
  
  // For now, just log it
  try {
    if (window.plausible) {
      window.plausible(eventName, { props: properties })
    }
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Standard events
export const AnalyticsEvents = {
  SIGN_UP: 'sign_up',
  CHECK_IN: 'check_in',
  REMINDER_SENT: 'reminder_sent',
  REMINDER_OPENED: 'reminder_opened',
  STREAK_LENGTH: 'streak_length',
  CHART_VIEW: 'chart_view',
  SETTINGS_UPDATED: 'settings_updated',
  ACCOUNT_DELETED: 'account_deleted',
} as const
