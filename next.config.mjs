/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // GitHub Pages 静态导出（使用自定义域名 ye.baziapi.site，从根路径访问）
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },

  swcMinify: true,
  compiler: {
    removeConsole: isProd,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
