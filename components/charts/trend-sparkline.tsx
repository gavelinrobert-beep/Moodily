'use client'

import { useEntries } from '@/lib/hooks/use-entries'
import { subDays } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { trackEvent } from '@/lib/utils/analytics'
import { useEffect } from 'react'
import { formatDate } from '@/lib/utils/date'

export function TrendSparkline() {
  const endDate = new Date()
  const startDate = subDays(endDate, 13) // Last 14 days
  const { data: entries, isLoading } = useEntries(startDate, endDate)

  useEffect(() => {
    if (entries && entries.length > 0) {
      trackEvent({ name: 'chart_view' })
    }
  }, [entries])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-40 bg-gray-100 rounded"></div>
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">14-Day Trend</h3>
        <div className="h-40 flex items-center justify-center text-gray-500">
          <p>No data yet. Start checking in to see your trend!</p>
        </div>
      </div>
    )
  }

  // Group entries by date and calculate daily averages
  const dailyData = entries.reduce((acc, entry) => {
    const date = formatDate(entry.created_at, 'MM/dd')
    if (!acc[date]) {
      acc[date] = { date, mood: [], energy: [] }
    }
    acc[date].mood.push(entry.mood)
    acc[date].energy.push(entry.energy)
    return acc
  }, {} as Record<string, { date: string; mood: number[]; energy: number[] }>)

  const chartData = Object.values(dailyData).map(day => ({
    date: day.date,
    mood: day.mood.reduce((sum, val) => sum + val, 0) / day.mood.length,
    energy: day.energy.reduce((sum, val) => sum + val, 0) / day.energy.length,
  })).reverse()

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">14-Day Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: number) => value.toFixed(1)}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#6366F1" 
            strokeWidth={2}
            dot={{ fill: '#6366F1', r: 3 }}
            name="Mood"
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 3 }}
            name="Energy"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-sm text-gray-600">Mood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Energy</span>
        </div>
      </div>
    </div>
  )
}
