import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Moodily - Track Your Daily Mood',
  description: 'Simple daily mood and energy tracking to understand your patterns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add your analytics script here in production */}
        {/* Example for Plausible: */}
        {/* <Script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js" /> */}
      </head>
      <body>
        {children}
        <Toaster position="top-center" />
        
        {/* Initialize analytics tracking function */}
        <Script id="analytics-init" strategy="afterInteractive">
          {`
            window.trackEvent = function(eventName, properties) {
              if (typeof window.plausible !== 'undefined') {
                window.plausible(eventName, { props: properties });
              }
              console.log('Analytics Event:', eventName, properties);
            };
          `}
        </Script>
      </body>
    </html>
  )
}
