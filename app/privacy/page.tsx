export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect minimal information necessary to provide our service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Email address:</strong> Used for authentication via magic link sign-in.
              </li>
              <li>
                <strong>Mood entries:</strong> Your daily mood ratings (1-5), energy levels (1-5),
                and optional short notes (up to 60 characters).
              </li>
              <li>
                <strong>User preferences:</strong> Timezone, notification preferences, and reminder
                pause settings.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2. How We Use Your Information
            </h2>
            <p>Your information is used solely to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authenticate you and maintain your account</li>
              <li>Store and display your mood tracking data</li>
              <li>Send daily reminder emails (if enabled)</li>
              <li>Calculate your streaks and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3. Data Storage and Security
            </h2>
            <p>
              All data is stored securely in Supabase (PostgreSQL database) with row-level security
              enabled. Only you can access your own mood entries and profile information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              4. Data Sharing
            </h2>
            <p>
              We do not share, sell, or rent your personal information to third parties. Your mood
              data is private and visible only to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access all your data at any time through the dashboard</li>
              <li>Delete specific entries or your entire account</li>
              <li>Export your data (available through settings)</li>
              <li>Opt out of reminder emails</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6. Data Deletion
            </h2>
            <p>
              You can delete your account and all associated data at any time from the Settings
              page. This action is permanent and cannot be undone.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              7. Analytics
            </h2>
            <p>
              We collect basic anonymized analytics (page views, feature usage) to improve the app.
              No personally identifiable information is tracked.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of
              significant changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9. Contact
            </h2>
            <p>
              If you have questions about this privacy policy, please contact us at the email
              address associated with this service.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/dashboard"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
