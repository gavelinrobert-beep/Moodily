'use client'

import { useMemo, useEffect } from 'react'
import { format, subDays } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Entry {
  mood: number
  energy: number
  created_at: string
}

interface WeeklyTrendProps {
  entries: Entry[]
}

export default function WeeklyTrend({ entries }: WeeklyTrendProps) {
  const chartData = useMemo(() => {
    const days = 14
    const now = new Date()
    const data = []

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      const dayEntries = entries.filter((entry) => {
        const entryDate = format(new Date(entry.created_at), 'yyyy-MM-dd')
        return entryDate === dateStr
      })

      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length
        : null

      const avgEnergy = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.energy, 0) / dayEntries.length
        : null

      data.push({
        date: format(date, 'MMM d'),
        mood: avgMood,
        energy: avgEnergy,
      })
    }

    return data
  }, [entries])

  useEffect(() => {
    // Track chart view event
    if (typeof window !== 'undefined' && (window as any).trackEvent) {
      (window as any).trackEvent('chart_view', { chart_type: 'weekly_trend' })
    }
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Last 14 Days
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ fill: '#6366F1', r: 4 }}
              connectNulls
              name="Mood"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', r: 4 }}
              connectNulls
              name="Energy"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
