'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import MoodCheckin from '@/components/MoodCheckin'
import WeeklyTrend from '@/components/WeeklyTrend'
import StreakBadge from '@/components/StreakBadge'
import WeekComparison from '@/components/WeekComparison'
import { useRouter } from 'next/navigation'

interface Entry {
  id: string
  mood: number
  energy: number
  note: string | null
  created_at: string
}

export default function DashboardClient({ user }: { user: User }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) {
        console.error('Error loading entries:', error)
      } else {
        setEntries(data || [])
        
        // Check if there's an entry today
        const today = new Date().toISOString().split('T')[0]
        const todayEntries = (data || []).filter((entry) => {
          const entryDate = new Date(entry.created_at).toISOString().split('T')[0]
          return entryDate === today
        })
        setTodayEntry(todayEntries[0] || null)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Moodily
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/settings"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Settings
            </a>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main check-in or today's entry */}
            {!todayEntry ? (
              <MoodCheckin onSuccess={loadEntries} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Today&apos;s Check-in ✓
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(todayEntry.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">Mood:</span>
                    <span className="text-2xl">
                      {['😢', '😕', '😐', '🙂', '😄'][todayEntry.mood - 1]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">Energy:</span>
                    <span className="text-2xl">
                      {todayEntry.energy === 5 ? '⚡' : '🔋'}
                    </span>
                  </div>
                  {todayEntry.note && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        &quot;{todayEntry.note}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats and visualizations */}
            {entries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StreakBadge />
                <WeekComparison entries={entries} />
              </div>
            ) : null}

            {entries.length > 0 ? (
              <WeeklyTrend entries={entries} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No entries yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your first check-in takes just 10 seconds!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
