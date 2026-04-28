'use client'

import { useState } from 'react'
import Hero from './Hero'
import ChatInterface from './ChatInterface'

type TabType = 'home' | 'paipan' | 'yijing' | 'hepan' | 'dayun'

export default function MainContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  return (
    <div className="h-screen overflow-hidden">
      {/* Hero 首屏 */}
      {activeTab === 'home' && (
        <div className="h-screen animate-fade-in">
          <Hero onStartClick={() => setActiveTab('paipan')} />
        </div>
      )}

      {/* 八字排盘对话 */}
      {activeTab === 'paipan' && (
        <div className="h-screen animate-fade-in">
          <ChatInterface />
        </div>
      )}

      {/* 易经占卜 */}
      {activeTab === 'yijing' && (
        <div className="h-screen flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-gradient-gold mb-4">易经占卜</h2>
            <p className="text-bazi-muted">功能开发中，敬请期待...</p>
          </div>
        </div>
      )}

      {/* 合盘分析 */}
      {activeTab === 'hepan' && (
        <div className="h-screen flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-gradient-gold mb-4">合盘分析</h2>
            <p className="text-bazi-muted">功能开发中，敬请期待...</p>
          </div>
        </div>
      )}

      {/* 大运流年 */}
      {activeTab === 'dayun' && (
        <div className="h-screen flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-gradient-gold mb-4">大运流年</h2>
            <p className="text-bazi-muted">功能开发中，敬请期待...</p>
          </div>
        </div>
      )}

      {/* 隐藏的导航触发器，供 Navbar 调用 */}
      <div id="nav-trigger" className="hidden" data-active-tab={activeTab} />
    </div>
  )
}

// 导出切换函数供外部使用
export function useTabNavigation() {
  return {
    navigateTo: (tab: TabType) => {
      const event = new CustomEvent('navigate-tab', { detail: tab })
      window.dispatchEvent(event)
    },
  }
}
