type AnalyticsEvent =
  | { name: 'sign_up'; properties?: Record<string, any> }
  | { name: 'check_in'; properties?: { mood: number; energy: number } }
  | { name: 'reminder_sent'; properties?: Record<string, any> }
  | { name: 'reminder_opened'; properties?: Record<string, any> }
  | { name: 'streak_length'; properties?: { streak: number } }
  | { name: 'chart_view'; properties?: Record<string, any> }

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return
  
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
  if (!enabled) {
    console.log('[Analytics]', event.name, event.properties)
    return
  }

  // In a real app, you would send this to your analytics service
  // For example: analytics.track(event.name, event.properties)
  console.log('[Analytics]', event.name, event.properties)
}
