'use client'

import { useStreak } from '@/lib/hooks/use-entries'
import { trackEvent } from '@/lib/utils/analytics'
import { useEffect } from 'react'

export function StreakBadge() {
  const { data: streak, isLoading } = useStreak()

  useEffect(() => {
    if (streak && streak.current_streak > 0) {
      trackEvent({ name: 'streak_length', properties: { streak: streak.current_streak } })
    }
  }, [streak])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-16"></div>
      </div>
    )
  }

  const currentStreak = streak?.current_streak || 0
  const longestStreak = streak?.longest_streak || 0

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔥</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Current Streak</h3>
          <p className="text-3xl font-bold text-gray-900">{currentStreak} days</p>
        </div>
      </div>
      {longestStreak > 0 && (
        <p className="text-sm text-gray-600">
          Longest streak: <span className="font-medium">{longestStreak} days</span>
        </p>
      )}
      {currentStreak === 0 && (
        <p className="text-sm text-gray-600 mt-2">
          Check in today to start your streak!
        </p>
      )}
    </div>
  )
}
