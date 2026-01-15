'use client'

import { useMemo } from 'react'
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'

interface Entry {
  mood: number
  energy: number
  created_at: string
}

interface WeekComparisonProps {
  entries: Entry[]
}

export default function WeekComparison({ entries }: WeekComparisonProps) {
  const comparison = useMemo(() => {
    const now = new Date()
    
    // This week
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 })
    
    // Last week
    const lastWeekStart = startOfWeek(subDays(now, 7), { weekStartsOn: 1 })
    const lastWeekEnd = endOfWeek(subDays(now, 7), { weekStartsOn: 1 })

    const thisWeekEntries = entries.filter((entry) => {
      const date = new Date(entry.created_at)
      return isWithinInterval(date, { start: thisWeekStart, end: thisWeekEnd })
    })

    const lastWeekEntries = entries.filter((entry) => {
      const date = new Date(entry.created_at)
      return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd })
    })

    const calcAvg = (arr: Entry[], key: 'mood' | 'energy') => {
      if (arr.length === 0) return 0
      return arr.reduce((sum, e) => sum + e[key], 0) / arr.length
    }

    const thisWeekMood = calcAvg(thisWeekEntries, 'mood')
    const lastWeekMood = calcAvg(lastWeekEntries, 'mood')
    const thisWeekEnergy = calcAvg(thisWeekEntries, 'energy')
    const lastWeekEnergy = calcAvg(lastWeekEntries, 'energy')

    return {
      moodDelta: thisWeekMood - lastWeekMood,
      energyDelta: thisWeekEnergy - lastWeekEnergy,
      thisWeekMood,
      lastWeekMood,
      thisWeekEnergy,
      lastWeekEnergy,
      hasData: thisWeekEntries.length > 0 && lastWeekEntries.length > 0,
    }
  }, [entries])

  const formatDelta = (delta: number) => {
    if (delta === 0) return '→ Same'
    const sign = delta > 0 ? '↑' : '↓'
    return `${sign} ${Math.abs(delta).toFixed(1)}`
  }

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-green-600 dark:text-green-400'
    if (delta < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  if (!comparison.hasData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Week Comparison
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Check in for at least 2 weeks to see trends
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        This Week vs Last Week
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mood</span>
            <span className={`text-sm font-semibold ${getDeltaColor(comparison.moodDelta)}`}>
              {formatDelta(comparison.moodDelta)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-500">
              {comparison.thisWeekMood.toFixed(1)}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(comparison.thisWeekMood / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Energy</span>
            <span className={`text-sm font-semibold ${getDeltaColor(comparison.energyDelta)}`}>
              {formatDelta(comparison.energyDelta)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-500">
              {comparison.thisWeekEnergy.toFixed(1)}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${(comparison.thisWeekEnergy / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
