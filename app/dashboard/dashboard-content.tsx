'use client'

import { CheckInForm } from '@/components/forms/check-in-form'
import { StreakBadge } from '@/components/ui/streak-badge'
import { WeeklyComparison } from '@/components/ui/weekly-comparison'
import { TrendSparkline } from '@/components/charts/trend-sparkline'
import { useEntries } from '@/lib/hooks/use-entries'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function DashboardContent() {
  const router = useRouter()
  const supabase = createClient()
  const { data: entries, isLoading } = useEntries()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  const showEmptyState = !isLoading && entries && entries.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Moodily</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/settings"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showEmptyState ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌟</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Moodily!</h2>
              <p className="text-lg text-gray-600 mb-2">
                No entries yet—your first one takes just 10 seconds.
              </p>
              <p className="text-gray-500">
                Track your daily mood and energy to understand your patterns and build healthy habits.
              </p>
            </div>
            <CheckInForm />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Check-in Form */}
            <div className="lg:col-span-2">
              <CheckInForm />
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              <StreakBadge />
              <WeeklyComparison />
            </div>

            {/* Full Width - Trend Chart */}
            <div className="lg:col-span-3">
              <TrendSparkline />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-4">
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}
