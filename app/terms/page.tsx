export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms of Service
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Moodily, you accept and agree to be bound by the terms and
              provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2. Description of Service
            </h2>
            <p>
              Moodily is a personal mood and energy tracking application. The service allows you
              to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Track daily mood and energy levels</li>
              <li>View historical trends and patterns</li>
              <li>Receive optional daily reminder emails</li>
              <li>Maintain streaks for consistent tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3. User Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information during registration</li>
              <li>Keep your login credentials secure</li>
              <li>Use the service for personal, non-commercial purposes only</li>
              <li>Not attempt to access other users&apos; data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              4. Medical Disclaimer
            </h2>
            <p className="font-semibold">
              Moodily is NOT a medical service or mental health treatment tool.
            </p>
            <p>
              This application is designed for personal wellness tracking only and should not be
              used as a substitute for professional medical advice, diagnosis, or treatment. If you
              are experiencing mental health concerns, please consult a qualified healthcare
              professional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5. Data Ownership
            </h2>
            <p>
              You retain full ownership of all data you enter into Moodily. We do not claim any
              rights to your mood entries or notes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6. Service Availability
            </h2>
            <p>
              While we strive for 100% uptime, we do not guarantee uninterrupted access to the
              service. Maintenance, updates, or technical issues may occasionally cause temporary
              unavailability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              Moodily and its operators shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              8. Account Termination
            </h2>
            <p>
              You may terminate your account at any time through the Settings page. We reserve the
              right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We may modify these terms at any time. Users will be notified of significant changes
              via email. Continued use of the service after changes constitutes acceptance of the
              new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              10. Contact
            </h2>
            <p>
              If you have questions about these terms, please contact us at the email address
              associated with this service.
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
