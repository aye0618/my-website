'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot } from 'lucide-react'
import { analyzeBazi, parseBirthInfo } from '@/lib/bazi-api'
import AuthModal from './AuthModal'
import Toast from './Toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const PRESET_QUESTIONS = [
  {
    title: '填写生辰',
    question: '',
    icon: '📝',
    isForm: true,
  },
  {
    title: '示例格式',
    question: '1995-08-20 14:00 女',
    icon: '✨',
    isForm: false,
  },
  {
    title: '详细分析',
    question: '出生日期：1988年3月12日，时间：8:30，性别：男',
    icon: '🔮',
    isForm: false,
  },
  {
    title: '输入提示',
    question: '请告诉我如何输入生辰信息',
    icon: '❓',
    isForm: false,
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 检查用户是否登录
  const checkLogin = () => {
    // TODO: 实际项目中应该检查真实的登录状态
    const isLoggedIn = localStorage.getItem('user_token')
    return !!isLoggedIn
  }

  // 显示提示信息
  const showMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // 检查登录状态
    if (!checkLogin()) {
      showMessage('还未登录，请先登录')
      setTimeout(() => {
        setShowAuthModal(true)
      }, 500)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const birthInfo = parseBirthInfo(input)

      if (birthInfo) {
        const result = await analyzeBazi(birthInfo)

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.success
            ? result.data || '分析完成，但未返回结果'
            : `分析失败：${result.error || '未知错误'}`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `请提供完整的生辰信息，格式示例：

📅 **标准格式：**
1990年5月15日 10时30分 男

📝 **其他支持格式：**
• 1990-05-15 10:30 男
• 出生日期：1990年5月15日，时间：10:30，性别：男

⚠️ **必填信息：**
• 出生年月日
• 出生时间（时和分）
• 性别（男/女）

请重新输入您的生辰信息。`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，分析过程中出现错误：${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (formData: { year: number; month: number; day: number; hour: number; minute: number; gender: 'male' | 'female' }) => {
    // 检查登录状态
    if (!checkLogin()) {
      showMessage('还未登录，请先登录')
      setShowForm(false)
      setTimeout(() => {
        setShowAuthModal(true)
      }, 500)
      return
    }

    setShowForm(false)
    setIsLoading(true)

    try {
      const result = await analyzeBazi(formData)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.success
          ? result.data || '分析完成，但未返回结果'
          : `分析失败：${result.error || '未知错误'}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，分析过程中出现错误：${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePresetClick = (question: string, isForm: boolean) => {
    if (isForm) {
      setShowForm(true)
    } else {
      setInput(question)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto pt-16">
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-6 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-5xl sm:text-6xl">☯</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-gold mb-3 sm:mb-4 px-4">
              AI 八字解读
            </h2>
            <p className="text-sm sm:text-base text-bazi-muted mb-6 sm:mb-8 px-4">
              千年命理智慧 × DeepSeek AI 深度解读
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {PRESET_QUESTIONS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetClick(preset.question, preset.isForm)}
                  className="text-left p-3 sm:p-4 bg-bazi-card border border-bazi-border rounded-lg hover:border-bazi-gold active:border-bazi-gold transition-all duration-300 group"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{preset.icon}</span>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-bazi-text group-hover:text-bazi-gold transition-colors mb-1">
                        {preset.title}
                      </h3>
                      {preset.question && (
                        <p className="text-xs sm:text-sm text-bazi-muted line-clamp-2">
                          {preset.question}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-bazi-gold/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-bazi-gold" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    message.role === 'user'
                      ? 'bg-bazi-gold/20 text-bazi-text'
                      : 'bg-bazi-card border border-bazi-border text-bazi-text'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
                  <span className="text-xs text-bazi-muted mt-1 sm:mt-2 block">
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-bazi-border flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-bazi-text" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 sm:gap-4 justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-bazi-gold/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-bazi-gold" />
                </div>
                <div className="bg-bazi-card border border-bazi-border rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-bazi-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-bazi-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-bazi-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-bazi-border bg-bazi-bg/80 backdrop-blur-xl p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的生辰信息或问题..."
                rows={1}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-bazi-card border border-bazi-border rounded-xl focus:border-bazi-gold focus:outline-none focus:ring-2 focus:ring-bazi-gold/20 transition-all resize-none max-h-32"
                style={{
                  minHeight: '44px',
                  height: 'auto',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`
                }}
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="relative group inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 mb-0.5"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-bazi-gold to-bazi-gold-light opacity-20 group-hover:opacity-40 group-active:opacity-50 blur-md transition-opacity duration-300" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-bazi-gold via-amber-500 to-bazi-gold-light flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)] group-hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-bazi-bg" />
                </div>
              </button>
            </div>
          </div>
          <p className="text-xs text-bazi-muted text-center mt-2 hidden sm:block">
            基于 DeepSeek R1 · 仅供娱乐参考
          </p>
        </div>
      </div>

      {showForm && (
        <BirthForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 登录弹窗 */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Toast 提示 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

function BirthForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { year: number; month: number; day: number; hour: number; minute: number; gender: 'male' | 'female' }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() - 30,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: 'male' as 'male' | 'female',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onCancel} />
      
      <div className="relative bg-bazi-card border-2 border-bazi-gold rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(201,168,76,0.5)] animate-fade-in-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold rounded-2xl opacity-20 blur-xl" />
        
        <div className="relative">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="text-2xl font-serif font-bold text-gradient-gold mb-2">
              填写生辰信息
            </h3>
            <p className="text-xs text-bazi-muted">请填写准确的出生信息</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-bazi-bg/50 rounded-xl p-4 border border-bazi-border/50">
              <label className="block text-sm font-medium text-bazi-gold mb-3">
                📅 出生日期
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1990 })}
                    min="1900"
                    max="2100"
                    required
                    className="w-full px-3 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none text-center text-lg font-medium"
                  />
                  <p className="text-xs text-bazi-muted text-center mt-1">年</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="12"
                    required
                    className="w-full px-3 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none text-center text-lg font-medium"
                  />
                  <p className="text-xs text-bazi-muted text-center mt-1">月</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="31"
                    required
                    className="w-full px-3 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none text-center text-lg font-medium"
                  />
                  <p className="text-xs text-bazi-muted text-center mt-1">日</p>
                </div>
              </div>
            </div>

            <div className="bg-bazi-bg/50 rounded-xl p-4 border border-bazi-border/50">
              <label className="block text-sm font-medium text-bazi-gold mb-3">
                ⏰ 出生时间
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={formData.hour}
                    onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="23"
                    required
                    className="w-full px-3 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none text-center text-lg font-medium"
                  />
                  <p className="text-xs text-bazi-muted text-center mt-1">时 (0-23)</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.minute}
                    onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="59"
                    required
                    className="w-full px-3 py-3 bg-bazi-bg border-2 border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none text-center text-lg font-medium"
                  />
                  <p className="text-xs text-bazi-muted text-center mt-1">分 (0-59)</p>
                </div>
              </div>
            </div>

            <div className="bg-bazi-bg/50 rounded-xl p-4 border border-bazi-border/50">
              <label className="block text-sm font-medium text-bazi-gold mb-3">
                👤 性别
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.gender === 'male' ? 'border-bazi-gold bg-bazi-gold/10' : 'border-bazi-border hover:border-bazi-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="sr-only"
                  />
                  <span className="text-2xl">♂</span>
                  <span className={`font-medium ${formData.gender === 'male' ? 'text-bazi-gold' : 'text-bazi-text'}`}>男</span>
                </label>
                <label className={`flex items-center justify-center gap-2 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.gender === 'female' ? 'border-bazi-gold bg-bazi-gold/10' : 'border-bazi-border hover:border-bazi-gold/50'
                }`}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="sr-only"
                  />
                  <span className="text-2xl">♀</span>
                  <span className={`font-medium ${formData.gender === 'female' ? 'text-bazi-gold' : 'text-bazi-text'}`}>女</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-4 bg-bazi-bg border-2 border-bazi-border hover:border-bazi-gold text-bazi-text rounded-xl transition-all font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-4 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold text-bazi-bg font-bold rounded-xl shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.7)] hover:scale-105 active:scale-95 transition-all text-lg"
              >
                ✨ 开始分析
              </button>
            </div>
          </form>

          <p className="text-xs text-bazi-muted text-center mt-4 bg-bazi-bg/30 rounded-lg p-2">
            💡 请确认信息准确无误
          </p>
        </div>
      </div>
    </div>
  )
}
