'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface MoodCheckinProps {
  onSuccess?: () => void
}

const MOODS = [
  { value: 1, emoji: '😢', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Not great' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Excellent' },
]

const ENERGY_LEVELS = [
  { value: 1, emoji: '🔋', label: 'Drained' },
  { value: 2, emoji: '🔋', label: 'Low' },
  { value: 3, emoji: '🔋', label: 'Medium' },
  { value: 4, emoji: '🔋', label: 'High' },
  { value: 5, emoji: '⚡', label: 'Energized' },
]

export default function MoodCheckin({ onSuccess }: MoodCheckinProps) {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mood || !energy) {
      toast.error('Please select your mood and energy level')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please sign in to submit')
        return
      }

      const { error } = await supabase.from('entries').insert({
        user_id: user.id,
        mood,
        energy,
        note: note.trim() || null,
      })

      if (error) {
        toast.error('Failed to save entry')
        console.error(error)
      } else {
        toast.success('Entry saved!')
        
        // Track check-in event
        if (typeof window !== 'undefined' && (window as any).trackEvent) {
          (window as any).trackEvent('check_in', { mood, energy })
        }

        // Reset form
        setMood(null)
        setEnergy(null)
        setNote('')

        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Today&apos;s Check-in
        </h2>
        
        <div className="space-y-6">
          {/* Mood selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling?
            </label>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    mood === m.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  aria-label={m.label}
                >
                  <span className="text-3xl mb-1">{m.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Energy level?
            </label>
            <div className="flex justify-between gap-2">
              {ENERGY_LEVELS.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => setEnergy(e.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    energy === e.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  aria-label={e.label}
                >
                  <span className="text-3xl mb-1">{e.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {e.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional note */}
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Quick note (optional)
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 60))}
              maxLength={60}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {note.length}/60 characters
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!mood || !energy || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {loading ? 'Saving...' : 'Save Entry'}
      </button>
    </form>
  )
}
