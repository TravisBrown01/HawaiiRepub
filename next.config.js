module.exports = {
  images: {
    domains: ['ui-avatars.com'],
  },
  // Build optimizations
  compress: true,
  poweredByHeader: false,
  // Faster builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}; 