'use client'

import { useState } from 'react'
import { useCreateEntry, useTodayEntry } from '@/lib/hooks/use-entries'
import toast from 'react-hot-toast'
import { logError } from '@/lib/utils/error-logger'

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄']
const ENERGY_EMOJIS = ['😴', '😪', '😐', '⚡', '🔥']

export function CheckInForm() {
  const [mood, setMood] = useState<number>(3)
  const [energy, setEnergy] = useState<number>(3)
  const [note, setNote] = useState('')
  const createEntry = useCreateEntry()
  const { data: todayEntries, isLoading } = useTodayEntry()

  const hasCheckedInToday = todayEntries && todayEntries.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (note.length > 60) {
      toast.error('Note must be 60 characters or less')
      return
    }

    try {
      await createEntry.mutateAsync({
        mood,
        energy,
        note: note || null,
      })

      toast.success('Check-in saved!')
      // Reset form to defaults
      setMood(3)
      setEnergy(3)
      setNote('')
    } catch (error) {
      logError(error as Error, { context: 'check-in-form' })
      toast.error('Failed to save check-in')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (hasCheckedInToday) {
    const todayEntry = todayEntries[0]
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Today's Check-in</h2>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{MOOD_EMOJIS[todayEntry.mood - 1]}</span>
            <div>
              <p className="text-sm text-gray-600">Mood</p>
              <p className="font-medium text-gray-900">Level {todayEntry.mood}/5</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{ENERGY_EMOJIS[todayEntry.energy - 1]}</span>
            <div>
              <p className="text-sm text-gray-600">Energy</p>
              <p className="font-medium text-gray-900">Level {todayEntry.energy}/5</p>
            </div>
          </div>
          {todayEntry.note && (
            <div className="pt-3 border-t border-green-200">
              <p className="text-sm text-gray-600 mb-1">Note</p>
              <p className="text-gray-900">{todayEntry.note}</p>
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-600">You've already checked in today! See you tomorrow. ✨</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Check-in</h2>

      <div className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How's your mood?
          </label>
          <div className="flex justify-between gap-2">
            {MOOD_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMood(index + 1)}
                className={`flex-1 py-4 text-4xl rounded-xl transition-all ${
                  mood === index + 1
                    ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                aria-label={`Mood level ${index + 1}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How's your energy?
          </label>
          <div className="flex justify-between gap-2">
            {ENERGY_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setEnergy(index + 1)}
                className={`flex-1 py-4 text-4xl rounded-xl transition-all ${
                  energy === index + 1
                    ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                aria-label={`Energy level ${index + 1}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Quick note (optional, max 60 chars)
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={60}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{note.length}/60 characters</p>
        </div>

        <button
          type="submit"
          disabled={createEntry.isPending}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {createEntry.isPending ? 'Saving...' : 'Save Check-in'}
        </button>
      </div>
    </form>
  )
}
