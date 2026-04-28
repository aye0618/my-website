/** @type {import('next').NextConfig} */
const nextConfig = {
  // 优化编译性能
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 减少内存使用
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
