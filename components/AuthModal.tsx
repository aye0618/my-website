'use client'

import { useState } from 'react'
import { X, Lock, User } from 'lucide-react'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'register') {
        // 验证密码
        if (formData.password.length < 6) {
          setError('密码长度至少6位')
          setIsLoading(false)
          return
        }

        // TODO: 调用注册 API
        console.log('注册:', formData)
        // 注册成功后保存 token 和用户名
        localStorage.setItem('user_token', 'demo_user_token')
        localStorage.setItem('username', formData.username)
        alert('注册成功!')
        onClose()
        // 刷新页面以更新导航栏
        window.location.reload()
      } else {
        // TODO: 调用登录 API
        console.log('登录:', formData)
        // 登录成功后保存 token 和用户名
        localStorage.setItem('user_token', 'demo_user_token')
        localStorage.setItem('username', formData.username)
        alert('登录成功!')
        onClose()
        // 刷新页面以更新导航栏
        window.location.reload()
      }
    } catch (err) {
      setError('操作失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setFormData({
      username: '',
      password: '',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* 登录/注册卡片 */}
      <div className="relative bg-bazi-card border-2 border-bazi-gold rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(201,168,76,0.5)] animate-fade-in-up">
        {/* 金色光晕 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold rounded-2xl opacity-20 blur-xl" />
        
        <div className="relative">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">🔐</span>
                <h3 className="text-2xl font-serif font-bold text-gradient-gold">
                  {mode === 'login' ? '登录账号' : '创建账号'}
                </h3>
              </div>
              <p className="text-xs text-bazi-muted">
                {mode === 'login' ? '欢迎回来，继续您的命理之旅' : '注册账号，开启命理探索'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bazi-border rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-bazi-muted hover:text-bazi-gold transition-colors" />
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                用户名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bazi-muted" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="请输入用户名"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bazi-muted" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={mode === 'register' ? '至少6位密码' : '请输入密码'}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                  className="w-full pl-10 pr-4 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-4 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold text-bazi-bg font-bold rounded-xl shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
            </button>
          </form>

          {/* 切换模式 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-bazi-muted">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
              <button
                onClick={switchMode}
                className="ml-2 text-bazi-gold hover:text-bazi-gold-light transition-colors font-medium"
              >
                {mode === 'login' ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>

          {/* 第三方登录 (可选) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-bazi-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bazi-card text-bazi-muted">或使用以下方式</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="px-4 py-3 bg-bazi-bg border-2 border-bazi-border hover:border-bazi-gold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">📱</span>
                <span className="text-sm text-bazi-text">微信</span>
              </button>
              <button
                type="button"
                className="px-4 py-3 bg-bazi-bg border-2 border-bazi-border hover:border-bazi-gold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">🔑</span>
                <span className="text-sm text-bazi-text">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
