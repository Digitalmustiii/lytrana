'use client';
import { useState } from 'react';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "What file formats does Lytrana support?",
      answer: "Currently, Lytrana supports CSV (Comma Separated Values) files. We're working on adding support for Excel files, JSON, and other popular data formats in future updates."
    },
    {
      question: "How secure is my data on Lytrana?",
      answer: "Your data security is our top priority. All files are encrypted in transit and at rest. We use industry-standard security measures and do not share your data with third parties. You can delete your data at any time."
    },
    {
      question: "Is there a file size limit for uploads?",
      answer: "Yes, currently there's a 50MB limit per file upload. For larger datasets, consider splitting your data into smaller files or contact us for enterprise solutions that support larger file sizes."
    },
    {
      question: "Can I share my analysis results with my team?",
      answer: "Absolutely! Lytrana provides easy sharing options for your analysis results. You can generate shareable links, export reports, or collaborate directly with team members through our platform."
    },
    {
      question: "Do I need technical knowledge to use Lytrana?",
      answer: "No technical expertise required! Lytrana is designed to be user-friendly for everyone. Simply upload your CSV file, and our platform will automatically generate insights and visualizations."
    },
    {
      question: "What types of analysis does Lytrana provide?",
      answer: "Lytrana provides comprehensive statistical analysis including descriptive statistics, data visualization, trend analysis, correlation analysis, and pattern detection. The specific analysis depends on your data structure."
    },
    {
      question: "Can I export my analysis results?",
      answer: "Yes, you can export your analysis results in multiple formats including PDF reports, PNG/JPG images of charts, and CSV files of processed data."
    },
    {
      question: "How long is my data stored on Lytrana?",
      answer: "Your data is stored securely for as long as you maintain your account. You can delete individual files or your entire account at any time. Deleted data is permanently removed from our servers."
    },
    {
      question: "Is there a mobile app for Lytrana?",
      answer: "While we don't have a dedicated mobile app yet, Lytrana is fully responsive and works great on mobile browsers. You can access all features from your smartphone or tablet."
    },
    {
      question: "How do I get support if I have issues?",
      answer: "You can reach out to our support team at sanusimustapha387@gmail.com. We typically respond within 24 hours and are here to help with any questions or technical issues."
    }
  ];

  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="text-gradient-brand">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Lytrana&apos;s features, security, and usage.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-[#1A2250] rounded-xl border border-gray-600 overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {item.question}
                </h3>
                {openItems[index] ? (
                  <ChevronUp className="h-5 w-5 text-[#2EF273] flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#2EF273] flex-shrink-0" />
                )}
              </button>
              
              {openItems[index] && (
                <div className="px-6 pb-4 border-t border-gray-600">
                  <p className="text-gray-300 pt-4 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-[#1A2250] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-300 mb-6">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
          </p>
          <a
            href="mailto:sanusimustapha387@gmail.com"
            className="gradient-brand px-8 py-4 text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-block"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}