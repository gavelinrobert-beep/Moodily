import Link from 'next/link'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-indigo max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Moodily, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700">
                Moodily is a personal mood and energy tracking application. It allows you to log your daily mood and energy levels, view trends over time, and maintain check-in streaks. The service is provided "as is" without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a user, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate information during registration</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Not Medical Advice</h2>
              <p className="text-gray-700">
                Moodily is a wellness tracking tool and is not intended to diagnose, treat, cure, or prevent any disease or medical condition. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Ownership</h2>
              <p className="text-gray-700">
                You retain all rights to the data you input into Moodily. We claim no intellectual property rights over the content you provide. You may export or delete your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
              <p className="text-gray-700">
                We strive to provide reliable service but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700">
                You may terminate your account at any time through the Settings page. We reserve the right to terminate or suspend access to the service for violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700">
                Moodily and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-700">
                If you have questions about these terms, please contact us at terms@moodily.app
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
