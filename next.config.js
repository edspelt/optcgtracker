/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  experimental: {
    optimizeCss: true,
    typedRoutes: true
  }
}

module.exports = nextConfig 