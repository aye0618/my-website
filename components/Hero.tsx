'use client'

import Button from './Button'
import { Sparkles } from 'lucide-react'

interface HeroProps {
  onStartClick?: () => void
}

export default function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* 主标题 */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 sm:mb-6 text-gradient-gold animate-fade-in-up leading-tight">
          AI 八字解读
        </h1>

        {/* 副标题 */}
        <p className="text-base sm:text-xl md:text-2xl text-bazi-muted mb-8 sm:mb-12 px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          千年命理智慧 × DeepSeek AI 深度解读
        </p>

        {/* CTA 按钮 */}
        <div className="mb-12 sm:mb-16 animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={onStartClick}
            className="group relative overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">输入生辰，开始分析</span>
            </span>
          </Button>
        </div>

        {/* 底部说明 */}
        <p className="text-xs sm:text-sm text-bazi-muted animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
          基于 DeepSeek R1 · 仅供娱乐参考
        </p>
      </div>
    </section>
  )
}
