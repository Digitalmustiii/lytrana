import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#161C40] border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Lytrana Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-gradient-brand text-2xl font-bold tracking-tight">
                Lytrana
              </h1>
              <span className="text-xs text-gray-300 -mt-1">Data Insights Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/upload" className="text-gray-400 hover:text-[#2EF273] transition-colors text-sm">
                  Data Upload
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="text-gray-400 hover:text-[#2EF273] transition-colors text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-400 hover:text-[#2EF273] transition-colors text-sm">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-[#2EF273] transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-[#2EF273] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <p className="text-gray-400 text-sm">
              Have questions? We&apos;d love to hear from you.
            </p>
            <Link
              href="/#contact"
              className="inline-block mt-3 text-[#2EF273] hover:text-white font-medium text-sm transition-colors"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Lytrana. All rights reserved.
          </p>
          <p className="text-[#2EF273] text-sm">
            Made by Mustiii</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-[#2EF273] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-[#2EF273] text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;