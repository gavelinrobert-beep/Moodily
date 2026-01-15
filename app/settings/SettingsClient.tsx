'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Profile {
  user_id: string
  timezone: string
  notification_pref: 'email' | 'push' | 'none'
  paused_until: string | null
}

interface SettingsClientProps {
  user: User
  profile: Profile | null
}

export default function SettingsClient({ user, profile }: SettingsClientProps) {
  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC')
  const [notificationPref, setNotificationPref] = useState<'email' | 'push' | 'none'>(
    profile?.notification_pref || 'email'
  )
  const [pausedUntil, setPausedUntil] = useState(profile?.paused_until || '')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          timezone,
          notification_pref: notificationPref,
          paused_until: pausedUntil || null,
        })

      if (error) {
        toast.error('Failed to save settings')
        console.error(error)
      } else {
        toast.success('Settings saved!')
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    if (!confirm('Are you absolutely sure? This cannot be undone.')) {
      return
    }

    setLoading(true)

    try {
      // Delete all entries
      await supabase.from('entries').delete().eq('user_id', user.id)

      // Delete profile
      await supabase.from('profiles').delete().eq('user_id', user.id)

      // Sign out and redirect
      await supabase.auth.signOut()
      toast.success('Account deleted')
      router.push('/auth/signin')
    } catch (error) {
      toast.error('Failed to delete account')
      console.error(error)
      setLoading(false)
    }
  }

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Preferences
            </h2>

            {/* Timezone */}
            <div className="mb-4">
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Preference */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reminder Notifications
              </label>
              <div className="space-y-2">
                {[
                  { value: 'email', label: 'Email reminders' },
                  { value: 'push', label: 'Push notifications (coming soon)' },
                  { value: 'none', label: 'No reminders' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="notification_pref"
                      value={option.value}
                      checked={notificationPref === option.value}
                      onChange={(e) =>
                        setNotificationPref(e.target.value as 'email' | 'push' | 'none')
                      }
                      disabled={option.value === 'push'}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pause reminders */}
            <div className="mb-4">
              <label
                htmlFor="pausedUntil"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pause reminders until (optional)
              </label>
              <input
                id="pausedUntil"
                type="date"
                value={pausedUntil}
                onChange={(e) => setPausedUntil(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Take a break from reminders. Leave empty to unpause.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Delete Account */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Permanently delete your account and all your data. This action cannot be undone.
          </p>
          <div className="mb-4">
            <label
              htmlFor="deleteConfirm"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Type DELETE to confirm
            </label>
            <input
              id="deleteConfirm"
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="DELETE"
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={loading || deleteConfirm !== 'DELETE'}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
