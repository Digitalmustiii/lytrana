import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#1A2250] rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">
            Privacy <span className="text-gradient-brand">Policy</span>
          </h1>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                upload data files, or contact us for support. This may include your name, email address, 
                and any data you choose to analyze on our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process your data analysis requests, communicate with you, and ensure the security 
                of our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information and 
                data files. All data is encrypted in transit and at rest. We do not share your 
                data with third parties without your consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. 
                You can also request that we delete your uploaded data files at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:sanusimustapha387@gmail.com" className="text-[#2EF273] hover:text-white">
                  sanusimustapha387@gmail.com
                </a>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-600">
              <p className="text-sm text-gray-400">
                Last updated: June 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}