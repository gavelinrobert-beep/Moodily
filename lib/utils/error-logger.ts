export function logError(error: Error, context?: Record<string, any>) {
  const enabled = process.env.NEXT_PUBLIC_ERROR_LOGGING_ENABLED === 'true'
  
  if (!enabled) {
    console.error('[Error]', error, context)
    return
  }

  // In a real app, you would send this to your error logging service
  // For example: Sentry.captureException(error, { extra: context })
  console.error('[Error]', error, context)
}
