/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  experimental: {
    optimizeCss: true,
    optimizeImages: true
  }
}

module.exports = nextConfig 