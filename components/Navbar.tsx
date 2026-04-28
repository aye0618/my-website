'use client'

import { useState, useEffect } from 'react'
import { Globe, Menu, X, User, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'
import { supabase } from '@/lib/supabase'

type TabType = 'home' | 'paipan' | 'yijing' | 'hepan' | 'dayun'

interface NavbarProps {
  onTabChange?: (tab: TabType) => void
}

export default function Navbar({ onTabChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // 从 Supabase 读取当前 session
    supabase.auth.getSession().then(({ data }) => {
      setUsername(data.session?.user?.email ?? null)
    })
    // 监听登录/登出变化
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsername(session?.user?.email ?? null)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUsername(null)
    setShowUserMenu(false)
    window.location.reload()
  }

  const navItems = [
    { label: '八字排盘', tab: 'paipan' as TabType },
    { label: '易经占卜', tab: 'yijing' as TabType },
  ]

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
    onTabChange?.(tab)
  }

  const handleLogoClick = () => {
    setActiveTab('home')
    onTabChange?.('home')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect border-b border-bazi-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 text-bazi-gold text-2xl">☯</div>
            <span className="text-2xl font-serif font-bold text-gradient-gold">
              八字
            </span>
          </button>

          {/* 桌面端导航项 */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`text-bazi-text hover:text-bazi-gold transition-colors duration-300 relative group cursor-pointer ${
                  activeTab === item.tab ? 'text-bazi-gold' : ''
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-bazi-gold to-bazi-gold-light transition-all duration-300 ${
                  activeTab === item.tab ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ))}
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-bazi-text hover:text-bazi-gold transition-colors"
              aria-label="切换语言"
            >
              <Globe className="w-5 h-5" />
            </button>
            
            {username ? (
              /* 已登录 - 显示用户名和下拉菜单 */
              <div className="relative hidden md:block user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-bazi-card border border-bazi-border hover:border-bazi-gold rounded-lg transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-bazi-gold/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-bazi-gold" />
                  </div>
                  <span className="text-bazi-text">{username}</span>
                </button>

                {/* 下拉菜单 */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-bazi-card border border-bazi-border rounded-lg shadow-lg overflow-hidden animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-bazi-border">
                      <p className="text-sm text-bazi-muted">登录为</p>
                      <p className="text-bazi-text font-medium">{username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 未登录 - 显示登录按钮 */
              <button 
                onClick={() => setShowAuthModal(true)}
                className="hidden md:block px-4 py-2 text-sm bg-bazi-card border border-bazi-border hover:border-bazi-gold text-bazi-text rounded-lg transition-all"
              >
                登录
              </button>
            )}
            
            {/* 移动端汉堡菜单按钮 */}
            <button
              className="md:hidden p-2 text-bazi-text hover:text-bazi-gold transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="菜单"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-bazi-border animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === item.tab
                    ? 'bg-bazi-gold/20 text-bazi-gold'
                    : 'text-bazi-text hover:text-bazi-gold hover:bg-bazi-card'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {username ? (
              /* 移动端 - 已登录 */
              <>
                <div className="px-4 py-3 bg-bazi-card rounded-lg">
                  <p className="text-xs text-bazi-muted mb-1">登录为</p>
                  <p className="text-bazi-text font-medium">{username}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-500 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </>
            ) : (
              /* 移动端 - 未登录 */
              <button 
                onClick={() => {
                  setShowAuthModal(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full px-4 py-3 text-sm bg-bazi-card border border-bazi-border hover:border-bazi-gold text-bazi-text rounded-lg transition-all"
              >
                登录
              </button>
            )}
          </div>
        </div>
      )}

      {/* 登录/注册弹窗 */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  )
}
