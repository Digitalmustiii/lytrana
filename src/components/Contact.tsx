import { Mail, MessageSquare, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#161C40] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in <span className="text-gradient-brand">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about Lytrana? Need help getting started? 
            We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600 text-center">
            <div className="w-12 h-12 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
            <p className="text-gray-300 text-sm mb-4">
              Send us an email and we&apos;ll get back to you soon.
            </p>
           <a 
            href="mailto:sanusimustapha387@gmail.com"
            className="text-[#2EF273] hover:text-white font-medium transition-colors"
            >
            sanusimustapha387@gmail.<br />com
            </a>
          </div>

          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600 text-center">
            <div className="w-12 h-12 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-gray-300 text-sm mb-4">
              Chat with our team for immediate assistance.
            </p>
            <button className="text-[#2EF273] hover:text-white font-medium transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600 text-center">
            <div className="w-12 h-12 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
            <p className="text-gray-300 text-sm mb-4">
              We typically respond within 24 hours.
            </p>
            <span className="text-[#2EF273] font-medium">
              Usually faster!
            </span>
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="bg-[#1A2250] rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg">
              Drop us a line and let&apos;s discuss how Lytrana can help transform your data analysis.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center space-x-3 bg-[#161C40] px-6 py-4 rounded-lg border border-gray-600">
                  <Mail className="w-5 h-5 text-[#2EF273]" />
                  <a 
                    href="mailto:sanusimustapha387@gmail.com"
                    className="text-white hover:text-[#2EF273] font-medium transition-colors"
                  >
                    sanusimustapha387@gmail.com
                  </a>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Whether you have questions about features, need technical support, 
                  or want to discuss enterprise solutions, we&apos;re here to help.
                </p>
              </div>

              <div className="text-center">
                <a href="mailto:sanusimustapha387@gmail.com">
                  <button className="gradient-brand px-8 py-4 text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Send us an Email
                </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-gray-300 mb-6">
            Looking for quick answers? Check out our FAQ section or reach out directly.
          </p>
          <a href="/faq"><button className="text-[#2EF273] hover:text-white font-medium transition-colors border border-[#2EF273] px-6 py-3 rounded-lg hover:bg-[#2EF273] hover:bg-opacity-10">
            View FAQ
          </button></a>
        </div>
      </div>
    </div>
  );
};

export default Contact;