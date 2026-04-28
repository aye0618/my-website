'use client'

import { useState } from 'react'
import { X, Lock, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [formData, setFormData] = useState({
    email: '',
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
      const email = formData.email.trim()
      const password = formData.password

      if (!email) {
        setError('邮箱不能为空')
        setIsLoading(false)
        return
      }

      if (mode === 'register') {
        if (password.length < 6) {
          setError('密码长度至少 6 位')
          setIsLoading(false)
          return
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) {
          setError(translateError(signUpError.message))
          setIsLoading(false)
          return
        }
        // 若开启了"邮箱验证"，session 会为 null，需用户去邮箱点确认链接
        if (!data.session) {
          alert('注册成功！请前往邮箱点击确认链接以完成验证后再登录。')
          setMode('login')
          setIsLoading(false)
          return
        }
        alert('注册成功！')
        onClose()
        window.location.reload()
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          setError(translateError(signInError.message))
          setIsLoading(false)
          return
        }
        alert('登录成功！')
        onClose()
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setFormData({ email: '', password: '' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* 登录/注册卡片 */}
      <div className="relative bg-bazi-card border-2 border-bazi-gold rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(201,168,76,0.5)] animate-fade-in-up">
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
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bazi-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
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
                  placeholder={mode === 'register' ? '至少 6 位密码' : '请输入密码'}
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
        </div>
      </div>
    </div>
  )
}

// 把 Supabase 的英文错误信息翻译成中文
function translateError(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials')) return '邮箱或密码错误'
  if (m.includes('user already registered')) return '该邮箱已被注册，请直接登录'
  if (m.includes('email not confirmed')) return '邮箱尚未验证，请前往邮箱点击确认链接'
  if (m.includes('password should be at least')) return '密码长度至少 6 位'
  if (m.includes('unable to validate email')) return '邮箱格式不正确'
  if (m.includes('rate limit')) return '操作过于频繁，请稍后再试'
  return msg
}
