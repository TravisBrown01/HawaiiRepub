module.exports = {
  images: {
    domains: ['ui-avatars.com'],
  },
  // Build optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Reduce bundle size
  experimental: {
    optimizeCss: true,
  },
  // Faster builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}; 