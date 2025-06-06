'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X, ChevronDown, Upload, Share2, BarChart3 } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-[#161C40] shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3">
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
         {/* Features Dropdown */}
<div className="relative group">
  <button
    className="flex items-center space-x-1 text-white hover:text-[#2EF273] transition-colors duration-200"
  >
    <span className="font-medium">Features</span>
    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
  </button>

  {/* Fixed dropdown with no gap */}
  <div className="absolute top-full left-0 w-56 bg-[#1A2250] rounded-lg shadow-lg border border-gray-600 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
   <Link href="/upload" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 hover:text-[#2EF273] transition-colors">
   <Upload className="h-4 w-4 mr-3" />
  Data Upload
    </Link>
    <Link href="/analysis" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 hover:text-[#2EF273] transition-colors">
    <BarChart3 className="h-4 w-4 mr-3" />
  Analytics
    </Link>
    <Link href="/reports" className="flex items-center px-4 py-2 text-white hover:bg-gray-700 hover:text-[#2EF273] transition-colors">
      <Share2 className="h-4 w-4 mr-3" />
      Reports
    </Link>
  </div>
</div>

            <Link href="/#about" className="text-white hover:text-[#2EF273] font-medium transition-colors duration-200">
              About
            </Link>
            <Link href="/#contact" className="text-white hover:text-[#2EF273] font-medium transition-colors duration-200">
              Contact
            </Link>
          </nav>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center space-x-3">
            {!isSignedIn ? (
              // Show Sign In and Sign Up buttons when not logged in
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-white hover:text-[#2EF273] font-medium transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="gradient-brand px-6 py-2 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-101 transition-all duration-200">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            ) : (
              // Show user profile and dashboard link when logged in
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Welcome, {user?.firstName || 'User'}!
                </span>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-[#2EF273] hover:text-[white] font-medium border border-[#2EF273] rounded-lg hover:bg-[#2EF273] hover:bg-opacity-10 transition-all duration-200"
                >
                  Dashboard
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-600 py-4 space-y-4">
            <div className="space-y-3">
              <Link href="/upload" className="flex items-center px-4 py-2 text-white hover:text-[#2EF273] transition-colors">
                <Upload className="h-4 w-4 mr-3" />
                Data Upload
              </Link>
              <Link href="/analysis" className="flex items-center px-4 py-2 text-white hover:text-[#2EF273] transition-colors">
                <BarChart3 className="h-4 w-4 mr-3" />
                Analytics
              </Link>
              <Link href="/reports" className="flex items-center px-4 py-2 text-white hover:text-[#2EF273] transition-colors">
                <Share2 className="h-4 w-4 mr-3" />
                Reports
              </Link>
              <Link href="/#about" className="block px-4 py-2 text-white hover:text-[#2EF273] transition-colors">
                About
              </Link>
              <Link href="/#contact" className="block px-4 py-2 text-white hover:text-[#2EF273] transition-colors">
                Contact
              </Link>
            </div>
            
            {/* Mobile Authentication */}
            <div className="border-t border-gray-600 pt-4 space-y-3 px-4">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="w-full text-left py-2 text-white hover:text-[#2EF273] font-medium transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full gradient-brand py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-2">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                    <span className="text-sm text-gray-300">
                      {user?.firstName || 'User'}
                    </span>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="block w-full gradient-brand py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 text-center"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;