import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self'; " +
              "style-src 'self' https://fonts.googleapis.com; " +
              "style-src-elem 'self' https://fonts.googleapis.com; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "img-src 'self' data: https: blob:; " +
              "media-src 'self' https:; " +
              "connect-src 'self' https:; " +
              "frame-ancestors 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "upgrade-insecure-requests;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Powered-By',
            value: '',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);