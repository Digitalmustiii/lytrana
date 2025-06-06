// next.config.ts
/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next';
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  compiler: { removeConsole: process.env.NODE_ENV === 'production' },

  images: { domains: process.env.IMAGE_DOMAINS?.split(',') || ['images.unsplash.com'] },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=59' }
        ]
      }
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);