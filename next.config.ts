/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next';
const withBundleAnalyzer = require('@next/bundle-analyzer')({ 
  enabled: process.env.ANALYZE === 'true' 
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  compiler: { 
    removeConsole: process.env.NODE_ENV === 'production' 
  },
  
  // Image optimization
  images: { 
    domains: process.env.IMAGE_DOMAINS?.split(',') || ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Compression and caching headers
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { 
            key: 'Cache-Control', 
            value: 'public, max-age=31536000, immutable' 
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          { 
            key: 'Cache-Control', 
            value: 's-maxage=60, stale-while-revalidate=59' 
          }
        ]
      },
      {
        source: '/(.*\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  // Enable compression
  compress: true,

  // Optimize build output
  output: 'standalone',
};

module.exports = withBundleAnalyzer(nextConfig);