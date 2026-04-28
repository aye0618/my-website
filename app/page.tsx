'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ChatInterface from '@/components/ChatInterface'
import YijingInterface from '@/components/YijingInterface'

type TabType = 'home' | 'paipan' | 'yijing'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  return (
    <>
      <Navbar onTabChange={setActiveTab} />
      
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
          <div className="h-screen animate-fade-in">
            <YijingInterface />
          </div>
        )}
      </div>
    </>
  )
}
