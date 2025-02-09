/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  experimental: {
    optimizeCss: true,
    serverActions: true,
    typedRoutes: true
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig 