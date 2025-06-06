import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable all optimizations that could cause issues
  swcMinify: false,
  
  // Disable experimental features
  experimental: {},
  
  // Basic webpack config to avoid issues
  webpack: (config, { dev }) => {
    // Disable webpack cache in production
    if (!dev) {
      config.cache = false
    }
    
    return config
  },
  
  // Disable image optimization if causing issues
  images: {
    unoptimized: true
  },
  
  // Disable type checking during build (still checks in dev)
  typescript: {
    ignoreBuildErrors: false
  },
  
  // Disable ESLint during builds if causing issues
  eslint: {
    ignoreDuringBuilds: false
  }
}

export default nextConfig