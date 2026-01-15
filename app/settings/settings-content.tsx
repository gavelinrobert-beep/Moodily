'use client'

import { useState, useEffect } from 'react'
import { useProfile, useUpdateProfile, useDeleteAccount } from '@/lib/hooks/use-profile'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getUserTimezone } from '@/lib/utils/date'

export function SettingsContent() {
  const router = useRouter()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const deleteAccount = useDeleteAccount()
  const [notificationPref, setNotificationPref] = useState<'email' | 'push' | 'none'>('email')
  const [pausedUntil, setPausedUntil] = useState<string>('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update state when profile loads
  useEffect(() => {
    if (profile) {
      setNotificationPref(profile.notification_pref)
      setPausedUntil(profile.paused_until || '')
    }
  }, [profile])

  const handleSaveSettings = async () => {
    try {
      await updateProfile.mutateAsync({
        notification_pref: notificationPref,
        paused_until: pausedUntil || null,
        timezone: getUserTimezone(),
      })
      toast.success('Settings saved!')
    } catch (_error) {
      toast.error('Failed to save settings')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync()
      toast.success('Account deleted')
      router.push('/auth/sign-in')
    } catch (_error) {
      toast.error('Failed to delete account')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              Moodily
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reminder Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Method
              </label>
              <select
                value={notificationPref}
                onChange={(e) => setNotificationPref(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="push">Push Notification</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pause Reminders Until
              </label>
              <input
                type="date"
                value={pausedUntil}
                onChange={(e) => setPausedUntil(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to receive reminders daily
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={updateProfile.isPending}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Management</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-medium text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                Deleting your account will permanently remove all your data. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-all"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-900">
                    Are you absolutely sure?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteAccount.isPending}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      {deleteAccount.isPending ? 'Deleting...' : 'Yes, delete my account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
