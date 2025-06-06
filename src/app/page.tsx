import Header from '@/components/Header'
import Footer from '@/components/Footer'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transform Your Data Into 
              <span className="text-gradient-brand block mt-2">
                Actionable Insights
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload your CSV files, get instant analysis, and collaborate with your team through beautiful, shareable reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/upload" 
                className="gradient-brand px-8 py-4 text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-block text-center"
              >
                Start Analyzing Now
              </Link>
              <button className="px-8 py-4 text-white font-semibold border-2 border-[#2EF273] rounded-lg hover:border-[#29D967] hover:bg-[#2EF273] hover:bg-opacity-10 transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1A2250]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for 
              <span className="text-gradient-brand"> Data Analysis</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to turn raw data into meaningful insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#161C40] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Data Upload</h3>
              <p className="text-gray-300">Simply drag and drop your CSV files or browse to upload. We handle the rest.</p>
            </div>
            
            <div className="bg-[#161C40] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
              <p className="text-gray-300">Get comprehensive statistical analysis and visualizations automatically generated.</p>
            </div>
            
            <div className="bg-[#161C40] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
              <p className="text-gray-300">Share insights and collaborate with your team through interactive dashboards.</p>
            </div>

            <div className="bg-[#161C40] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mobile Ready</h3>
              <p className="text-gray-300">Access your data insights on any device, anywhere, anytime.</p>
            </div>

            <div className="bg-[#161C40] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-300">Your data is encrypted and secure. We prioritize your privacy and data protection.</p>
            </div>

            <div className="bg-[#161C40] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300">
              <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Export Reports</h3>
              <p className="text-gray-300">Generate and export professional reports in multiple formats for presentations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to unlock your 
            <span className="text-gradient-brand"> data&apos;s potential?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of data-driven teams who trust Lytrana for their analytics needs.
          </p>
          <Link 
            href="/upload"
            className="gradient-brand px-8 py-4 text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <About />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </div>
  )
}