import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Moodily
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-indigo max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect minimal information to provide you with our service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Email address:</strong> Used for authentication via magic link sign-in</li>
                <li><strong>Mood and energy data:</strong> Your daily check-ins including mood ratings (1-5), energy ratings (1-5), and optional notes (max 60 characters)</li>
                <li><strong>Account settings:</strong> Timezone and notification preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                Your data is used exclusively for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Providing you access to your Moodily account</li>
                <li>Displaying your mood and energy trends</li>
                <li>Calculating your check-in streaks</li>
                <li>Sending daily reminder emails (if enabled)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
              <p className="text-gray-700">
                We use industry-standard security measures to protect your data. All data is stored securely using Supabase's infrastructure with Row Level Security (RLS) enabled, ensuring you can only access your own data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing</h2>
              <p className="text-gray-700">
                We do not sell, rent, or share your personal information with third parties. Your mood and energy data is private and belongs to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access all your data at any time through the app</li>
                <li>Update your preferences in the Settings page</li>
                <li>Delete your account and all associated data permanently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Account Deletion</h2>
              <p className="text-gray-700">
                You can delete your account at any time from the Settings page. This will permanently remove all your mood entries, profile data, and account information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-700">
                If you have questions about this privacy policy, please contact us at privacy@moodily.app
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
