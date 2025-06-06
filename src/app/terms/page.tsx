import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#1A2250] rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">
            Terms of <span className="text-gradient-brand">Service</span>
          </h1>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using Lytrana, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please 
                do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Use of Service</h2>
              <p>
                You may use our platform to upload, analyze, and visualize your data. You are 
                responsible for ensuring that your data does not violate any laws or third-party 
                rights. You must not use our service for any illegal or unauthorized purpose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and 
                password. You agree to accept responsibility for all activities that occur 
                under your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Ownership</h2>
              <p>
                You retain all rights to the data you upload to our platform. We do not claim 
                ownership of your data and will not use it for any purpose other than providing 
                our services to you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p>
                We strive to maintain high availability of our service, but we cannot guarantee 
                uninterrupted access. We reserve the right to modify or discontinue the service 
                at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>
                For any questions regarding these Terms of Service, please contact us at{' '}
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