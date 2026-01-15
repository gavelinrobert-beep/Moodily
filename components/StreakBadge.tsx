'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function StreakBadge() {
  const [streak, setStreak] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase.rpc('get_current_streak', {
          p_user_id: user.id,
        })

        if (error) {
          console.error('Error loading streak:', error)
        } else {
          setStreak(data || 0)
          
          // Track streak length event
          if (data > 0 && typeof window !== 'undefined' && window.trackEvent) {
            window.trackEvent('streak_length', { days: data })
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStreak()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Current Streak
      </h3>
      <div className="flex items-center gap-4">
        <div className="text-6xl">🔥</div>
        <div>
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {streak}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>
      {streak > 0 && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {streak >= 7
            ? "Amazing! You're building a great habit!"
            : "Keep it going! Don't break the chain."}
        </p>
      )}
    </div>
  )
}
