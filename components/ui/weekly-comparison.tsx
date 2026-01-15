'use client'

import { useWeeklyStats } from '@/lib/hooks/use-entries'

export function WeeklyComparison() {
  const { data: stats, isLoading } = useWeeklyStats()

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded"></div>
          <div className="h-16 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const moodDelta = stats.thisWeek.avgMood - stats.lastWeek.avgMood
  const energyDelta = stats.thisWeek.avgEnergy - stats.lastWeek.avgEnergy

  const formatDelta = (delta: number) => {
    if (delta > 0) return `+${delta.toFixed(1)}`
    return delta.toFixed(1)
  }

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-green-600'
    if (delta < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return '↑'
    if (delta < 0) return '↓'
    return '→'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week vs Last</h3>
      
      {stats.thisWeek.count === 0 ? (
        <p className="text-gray-500 text-sm">No entries this week yet</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mood</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek.avgMood.toFixed(1)}</p>
            </div>
            {stats.lastWeek.count > 0 && (
              <div className={`flex items-center gap-1 ${getDeltaColor(moodDelta)}`}>
                <span className="text-2xl">{getDeltaIcon(moodDelta)}</span>
                <span className="font-semibold">{formatDelta(moodDelta)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Energy</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek.avgEnergy.toFixed(1)}</p>
            </div>
            {stats.lastWeek.count > 0 && (
              <div className={`flex items-center gap-1 ${getDeltaColor(energyDelta)}`}>
                <span className="text-2xl">{getDeltaIcon(energyDelta)}</span>
                <span className="font-semibold">{formatDelta(energyDelta)}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">
            {stats.thisWeek.count} {stats.thisWeek.count === 1 ? 'entry' : 'entries'} this week
          </p>
        </div>
      )}
    </div>
  )
}
