'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: FileText, label: '占卜记录', path: '/admin/records' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bazi-bg flex">
      {/* 侧边栏 - 桌面端 */}
      <aside className={`hidden md:flex flex-col bg-bazi-card border-r border-bazi-border transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-bazi-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">☯</span>
              <span className="text-lg font-serif font-bold text-gradient-gold">
                后台管理
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-bazi-border rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-bazi-muted transition-transform ${
              !sidebarOpen ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* 菜单项 */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-bazi-gold/20 text-bazi-gold'
                    : 'text-bazi-text hover:bg-bazi-border hover:text-bazi-gold'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* 退出登录 */}
        <div className="p-4 border-t border-bazi-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            title={!sidebarOpen ? '退出登录' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* 移动端侧边栏 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-bazi-card border-r border-bazi-border flex flex-col animate-slide-in-left">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-bazi-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl">☯</span>
                <span className="text-lg font-serif font-bold text-gradient-gold">
                  后台管理
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-bazi-border rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-bazi-muted" />
              </button>
            </div>

            {/* 菜单项 */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-bazi-gold/20 text-bazi-gold'
                        : 'text-bazi-text hover:bg-bazi-border hover:text-bazi-gold'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* 退出登录 */}
            <div className="p-4 border-t border-bazi-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">退出登录</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="h-16 bg-bazi-card border-b border-bazi-border flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-bazi-border rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-bazi-text" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-bazi-text">管理员</p>
              <p className="text-xs text-bazi-muted">admin@bazi.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-bazi-gold/20 flex items-center justify-center">
              <span className="text-bazi-gold font-bold">A</span>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
