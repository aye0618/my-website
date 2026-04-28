import type { Metadata, Viewport } from 'next'
import './globals.css'
import TaijiBackground from '@/components/TaijiBackground'

export const metadata: Metadata = {
  title: 'AI 八字解读 - 千年命理 × DeepSeek AI',
  description: '基于 DeepSeek R1 的智能八字命理分析平台，结合传统命理学与现代 AI 技术',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bazi-bg text-bazi-text font-sans">
        <TaijiBackground />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
