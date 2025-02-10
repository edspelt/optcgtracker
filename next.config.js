/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  experimental: {
    optimizeCss: true,
    typedRoutes: true,
    speedInsights: {
      enabled: true,
    },
  }
}

module.exports = nextConfig 