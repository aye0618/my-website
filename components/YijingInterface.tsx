'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthModal from './AuthModal'
import Toast from './Toast'

type Step = 1 | 2 | 3

const PRESET_QUESTIONS = [
  { title: '感情问题', question: '我和恋人最近经常争吵，这段关系还会长久吗？', icon: '💕' },
  { title: '事业决策', question: '我应该接受这份新工作offer吗？', icon: '💼' },
  { title: '学业抉择', question: '我应该选择哪个专业更适合我？', icon: '📚' },
  { title: '财运问询', question: '最近有一个投资机会，我应该参与吗？', icon: '💰' },
]

const HEXAGRAMS = [
  { name: '乾为天', upper: '☰', lower: '☰', desc: '刚健中正，自强不息' },
  { name: '坤为地', upper: '☷', lower: '☷', desc: '柔顺厚德，厚德载物' },
  { name: '水雷屯', upper: '☵', lower: '☳', desc: '万物始生，艰难困顿' },
  { name: '山水蒙', upper: '☶', lower: '☵', desc: '启蒙教育，循序渐进' },
  { name: '水天需', upper: '☵', lower: '☰', desc: '等待时机，不可妄动' },
  { name: '天水讼', upper: '☰', lower: '☵', desc: '争讼纠纷，宜和为贵' },
]

export default function YijingInterface() {
  const [step, setStep] = useState<Step>(1)
  const [question, setQuestion] = useState('')
  const [hexagram, setHexagram] = useState<typeof HEXAGRAMS[0] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [divinationProgress, setDivinationProgress] = useState(0)
  const [yaoLines, setYaoLines] = useState<string[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // 检查用户是否登录
  const checkLogin = () => {
    const isLoggedIn = localStorage.getItem('user_token')
    return !!isLoggedIn
  }

  // 显示提示信息
  const showMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleStartDivination = () => {
    if (!question.trim()) return
    
    // 检查登录状态
    if (!checkLogin()) {
      showMessage('还未登录，请先登录')
      setTimeout(() => {
        setShowAuthModal(true)
      }, 500)
      return
    }
    
    setStep(2)
    setIsAnimating(true)
    setDivinationProgress(0)
    setYaoLines([])
    
    // 模拟6次投掷铜钱，生成6爻
    const yaoTypes = ['——', '— —'] // 阳爻和阴爻
    let currentYao = 0
    
    const interval = setInterval(() => {
      if (currentYao < 6) {
        currentYao++
        setDivinationProgress(currentYao)
        setYaoLines(prev => [...prev, yaoTypes[Math.floor(Math.random() * 2)]])
      } else {
        clearInterval(interval)
        const randomHex = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)]
        setHexagram(randomHex)
        setIsAnimating(false)
        
        // 2秒后自动进入解读页面
        setTimeout(() => {
          setStep(3)
        }, 2000)
      }
    }, 800) // 每0.8秒生成一爻
  }

  const handleSkipAnimation = () => {
    setIsAnimating(false)
    const randomHex = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)]
    setHexagram(randomHex)
    setDivinationProgress(6)
    setYaoLines(['——', '— —', '——', '——', '— —', '——'])
    
    setTimeout(() => {
      setStep(3)
    }, 500)
  }

  const handleReset = () => {
    setStep(1)
    setQuestion('')
    setHexagram(null)
    setIsAnimating(false)
    setDivinationProgress(0)
    setYaoLines([])
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto pt-16 px-4">
      {/* 步骤指示器 */}
      <div className="flex justify-center items-center gap-4 mb-8 py-4">
        <div className="flex items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
            step >= 1 ? 'bg-bazi-gold text-bazi-bg' : 'bg-bazi-border text-bazi-muted'
          }`}>
            1
          </div>
          <span className={`text-sm ${step >= 1 ? 'text-bazi-gold' : 'text-bazi-muted'}`}>提出问题</span>
        </div>
        
        <div className="text-bazi-gold text-2xl">→</div>
        
        <div className="flex items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
            step >= 2 ? 'bg-bazi-gold text-bazi-bg' : 'bg-bazi-border text-bazi-muted'
          }`}>
            2
          </div>
          <span className={`text-sm ${step >= 2 ? 'text-bazi-gold' : 'text-bazi-muted'}`}>卜卦</span>
        </div>
        
        <div className="text-bazi-gold text-2xl">→</div>
        
        <div className="flex items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
            step >= 3 ? 'bg-bazi-gold text-bazi-bg' : 'bg-bazi-border text-bazi-muted'
          }`}>
            3
          </div>
          <span className={`text-sm ${step >= 3 ? 'text-bazi-gold' : 'text-bazi-muted'}`}>查看解读</span>
        </div>
      </div>

      {/* 第1步：提出问题 */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-6xl mb-6">🔮</div>
          <h2 className="text-3xl font-serif font-bold text-gradient-gold mb-4">
            易经占卜
          </h2>
          <p className="text-bazi-muted mb-8 text-center">
            请静心提出您的问题，一事一测
          </p>

          {/* 预设问题 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mb-6">
            {PRESET_QUESTIONS.map((preset, index) => (
              <button
                key={index}
                onClick={() => setQuestion(preset.question)}
                className="text-left p-4 bg-bazi-card border border-bazi-border rounded-lg hover:border-bazi-gold transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{preset.icon}</span>
                  <div>
                    <h3 className="font-medium text-bazi-text group-hover:text-bazi-gold transition-colors mb-1">
                      {preset.title}
                    </h3>
                    <p className="text-sm text-bazi-muted line-clamp-2">
                      {preset.question}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 输入框 */}
          <div className="w-full max-w-2xl">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="或者输入您自己的问题..."
              rows={3}
              className="w-full px-4 py-3 bg-bazi-card border border-bazi-border rounded-xl focus:border-bazi-gold focus:outline-none focus:ring-2 focus:ring-bazi-gold/20 transition-all resize-none mb-4"
            />
            
            <button
              onClick={handleStartDivination}
              disabled={!question.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold text-bazi-bg font-bold rounded-xl shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              开始占卜
            </button>
          </div>
        </div>
      )}

      {/* 第2步：卜卦动画 */}
      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in px-4">
          {isAnimating ? (
            <div className="w-full max-w-2xl">
              <div className="bg-bazi-card/50 border border-bazi-border rounded-2xl p-8">
                <p className="text-bazi-muted text-center mb-6">
                  我们将使用传统的掷币方法为您卜卦，模拟古代易经占卜过程
                </p>

                {/* 三个铜钱动画 - 写实 SVG */}
                <div className="flex justify-center gap-4 mb-8">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-20 h-20 rounded-full overflow-hidden bg-[#2a1810]"
                      animate={{
                        y: [0, -40, 0],
                        rotateZ: [0, 360, 720],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: 'easeInOut',
                      }}
                    >
                      <svg 
                        width="80" 
                        height="80" 
                        viewBox="0 0 100 100" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block' }}
                      >
                        <defs>
                          {/* 铜质渐变 */}
                          <radialGradient id={`copperGrad${index}`} cx="40%" cy="40%">
                            <stop offset="0%" stopColor="#f4a460" />
                            <stop offset="40%" stopColor="#d2691e" />
                            <stop offset="70%" stopColor="#b8860b" />
                            <stop offset="100%" stopColor="#5a3a1a" />
                          </radialGradient>
                          
                          {/* 高光 */}
                          <radialGradient id={`highlight${index}`} cx="30%" cy="30%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#fff" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                          </radialGradient>
                          
                          {/* 铜锈纹理 */}
                          <filter id={`rust${index}`}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed={index} />
                            <feColorMatrix type="saturate" values="0.3" />
                            <feBlend mode="multiply" in="SourceGraphic" />
                          </filter>
                        </defs>
                        
                        {/* 背景圆 - 确保没有空隙 */}
                        <circle cx="50" cy="50" r="50" fill={`url(#copperGrad${index})`} />
                        
                        {/* 铜锈效果 */}
                        <circle cx="50" cy="50" r="48" fill={`url(#copperGrad${index})`} filter={`url(#rust${index})`} opacity="0.25" />
                        
                        {/* 内圈凹槽 */}
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#3a2010" strokeWidth="1" opacity="0.5" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#8b6914" strokeWidth="0.5" opacity="0.3" />
                        
                        {/* 方孔外框 */}
                        <rect x="41" y="41" width="18" height="18" fill="#1a0f08" rx="1" />
                        {/* 方孔内部 */}
                        <rect x="42.5" y="42.5" width="15" height="15" fill="#2a1810" />
                        
                        {/* 開元通宝文字 */}
                        <text x="50" y="27" textAnchor="middle" fill="#1a0f08" fontSize="11" fontWeight="bold" fontFamily="serif">開</text>
                        <text x="73" y="54" textAnchor="middle" fill="#1a0f08" fontSize="11" fontWeight="bold" fontFamily="serif">元</text>
                        <text x="50" y="81" textAnchor="middle" fill="#1a0f08" fontSize="11" fontWeight="bold" fontFamily="serif">通</text>
                        <text x="27" y="54" textAnchor="middle" fill="#1a0f08" fontSize="11" fontWeight="bold" fontFamily="serif">宝</text>
                        
                        {/* 高光效果 */}
                        <circle cx="50" cy="50" r="48" fill={`url(#highlight${index})`} />
                        
                        {/* 边缘暗部 */}
                        <circle cx="50" cy="50" r="49" fill="none" stroke="#2a1810" strokeWidth="2" opacity="0.5" />
                      </svg>
                    </motion.div>
                  ))}
                </div>

                {/* 进度条 */}
                <div className="mb-6">
                  <p className="text-center text-bazi-gold font-medium mb-2">
                    正在卜卦 {divinationProgress} / 6
                  </p>
                  <div className="w-full h-2 bg-bazi-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-bazi-gold to-bazi-gold-light transition-all duration-500"
                      style={{ width: `${(divinationProgress / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 六爻显示 */}
                <div className="space-y-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-bazi-muted text-sm w-12">
                        {index === 0 ? '上爻' : index === 1 ? '五爻' : index === 2 ? '四爻' : index === 3 ? '三爻' : index === 4 ? '二爻' : '初爻'}
                      </span>
                      <div className="flex-1 h-8 bg-bazi-bg rounded flex items-center justify-center">
                        {yaoLines[index] ? (
                          <span className="text-2xl font-bold text-bazi-gold animate-fade-in">
                            {yaoLines[index]}
                          </span>
                        ) : (
                          <div className="w-full h-1 bg-bazi-border rounded" />
                        )}
                      </div>
                      <span className="text-bazi-muted text-sm w-12 text-right">
                        {yaoLines[index] ? (yaoLines[index] === '——' ? '阳' : '阴') : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 跳过动画按钮 */}
                <button
                  onClick={handleSkipAnimation}
                  className="w-full px-6 py-3 border-2 border-bazi-gold text-bazi-gold hover:bg-bazi-gold hover:text-bazi-bg rounded-xl transition-all font-medium"
                >
                  跳过动画
                </button>
              </div>
            </div>
          ) : hexagram && (
            <>
              <div className="text-8xl mb-6 animate-fade-in-up">
                {hexagram.upper}
                <br />
                {hexagram.lower}
              </div>
              <h3 className="text-3xl font-serif font-bold text-gradient-gold mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {hexagram.name}
              </h3>
              <p className="text-bazi-muted animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {hexagram.desc}
              </p>
            </>
          )}
        </div>
      )}

      {/* 第3步：查看解读 */}
      {step === 3 && hexagram && (
        <div className="flex-1 overflow-y-auto py-8 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            {/* 卦象展示 */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {hexagram.upper}
                <br />
                {hexagram.lower}
              </div>
              <h3 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
                {hexagram.name}
              </h3>
              <p className="text-bazi-muted mb-4">{hexagram.desc}</p>
              <div className="inline-block px-4 py-2 bg-bazi-card border border-bazi-border rounded-lg">
                <p className="text-sm text-bazi-muted">您的问题：</p>
                <p className="text-bazi-text">{question}</p>
              </div>
            </div>

            {/* AI 解读 */}
            <div className="space-y-6">
              <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
                <h4 className="text-xl font-bold text-bazi-gold mb-3 flex items-center gap-2">
                  <span>📖</span>
                  卦辞
                </h4>
                <p className="text-bazi-text leading-relaxed">
                  此卦象征着{hexagram.desc}。针对您的问题"{question}"，卦象显示当前局势正处于关键时刻。
                  天道运行，自有其规律，顺应天时，方能趋吉避凶。
                </p>
              </div>

              <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
                <h4 className="text-xl font-bold text-bazi-gold mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  针对性分析
                </h4>
                <div className="space-y-3 text-bazi-text">
                  <p><strong className="text-bazi-gold">• 当前状况：</strong>您所面临的情况需要谨慎对待，不可轻举妄动。</p>
                  <p><strong className="text-bazi-gold">• 发展趋势：</strong>顺应自然规律，静待时机成熟，切勿强求。</p>
                  <p><strong className="text-bazi-gold">• 行动建议：</strong>保持耐心，多观察少行动，待局势明朗后再做决定。</p>
                  <p><strong className="text-bazi-gold">• 注意事项：</strong>避免冲动，多听取他人意见，但最终决定权在自己手中。</p>
                </div>
              </div>

              <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
                <h4 className="text-xl font-bold text-bazi-gold mb-3 flex items-center gap-2">
                  <span>💡</span>
                  总结建议
                </h4>
                <p className="text-bazi-text leading-relaxed">
                  此卦提示您要顺势而为，不可逆天而行。当前虽有困难，但只要保持正道，终会迎来转机。
                  建议您在做决定前，多方考虑，权衡利弊，以求最佳结果。
                </p>
              </div>
            </div>

            {/* 重新占卜按钮 */}
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-bazi-card border-2 border-bazi-gold hover:bg-bazi-gold hover:text-bazi-bg text-bazi-gold font-medium rounded-xl transition-all"
              >
                重新占卜
              </button>
            </div>

            <p className="text-xs text-bazi-muted text-center mt-6">
              * 以上解读仅供参考，最终决策请结合实际情况理性判断
            </p>
          </div>
        </div>
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
