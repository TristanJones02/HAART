import type { NextConfig } from 'next';
import { redirects, hostRedirects } from './redirects';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1140, 1440],
    imageSizes: [96, 160, 240, 320, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'www.petrescue.com.au' },
      { protocol: 'https', hostname: '*.petrescue.com.au' },
      { protocol: 'https', hostname: 'maps.geoapify.com' },
      { protocol: 'https', hostname: 'api.maptiler.com' },
    ],
  },
  async redirects() {
    return [...hostRedirects, ...redirects];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
