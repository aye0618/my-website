'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Settings } from 'lucide-react'
import { useBaziStore } from '@/store/bazi-store'
import Button from './Button'
import Toast from './Toast'

export default function BaziForm() {
  const { formData, setFormData } = useBaziStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const hours = [
    { value: '23-01', label: '子时 (23:00-01:00)' },
    { value: '01-03', label: '丑时 (01:00-03:00)' },
    { value: '03-05', label: '寅时 (03:00-05:00)' },
    { value: '05-07', label: '卯时 (05:00-07:00)' },
    { value: '07-09', label: '辰时 (07:00-09:00)' },
    { value: '09-11', label: '巳时 (09:00-11:00)' },
    { value: '11-13', label: '午时 (11:00-13:00)' },
    { value: '13-15', label: '未时 (13:00-15:00)' },
    { value: '15-17', label: '申时 (15:00-17:00)' },
    { value: '17-19', label: '酉时 (17:00-19:00)' },
    { value: '19-21', label: '戌时 (19:00-21:00)' },
    { value: '21-23', label: '亥时 (21:00-23:00)' },
    { value: 'unknown', label: '不确定' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 提交表单逻辑
    console.log('提交八字数据:', formData)
    setShowToast(true)
  }

  return (
    <>
      <div id="bazi-form" className="w-full max-w-2xl">
        <div className="bg-bazi-card border border-bazi-border rounded-xl p-8 card-hover">
          {/* 表单标题 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
              输入生辰信息
            </h2>
            <p className="text-bazi-muted">
              请准确填写出生日期和时辰，以获得精准的八字分析
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 公历/农历切换 */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bazi-gold" />
                历法选择
              </label>
              <div className="flex gap-2">
                {(['solar', 'lunar'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ calendarType: type })}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-300 ${
                      formData.calendarType === type
                        ? 'bg-bazi-gold/20 border-bazi-gold text-bazi-gold'
                        : 'bg-bazi-bg/50 border-bazi-border text-bazi-muted hover:border-bazi-gold/50'
                    }`}
                  >
                    {type === 'solar' ? '公历' : '农历'}
                  </button>
                ))}
              </div>
            </div>

            {/* 出生日期 */}
            <div>
              <label className="block text-sm font-medium mb-3">
                出生日期
              </label>
              <input
                type="date"
                value={formData.birthDate?.toISOString().split('T')[0] || ''}
                onChange={(e) =>
                  setFormData({ birthDate: e.target.value ? new Date(e.target.value) : null })
                }
                className="w-full px-4 py-3 bg-bazi-bg/50 border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none focus:ring-2 focus:ring-bazi-gold/20 transition-all"
                required
              />
            </div>

            {/* 出生时辰 */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-bazi-gold" />
                出生时辰
              </label>
              <select
                value={formData.birthHour}
                onChange={(e) => setFormData({ birthHour: e.target.value })}
                className="w-full px-4 py-3 bg-bazi-bg/50 border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none focus:ring-2 focus:ring-bazi-gold/20 transition-all"
                required
              >
                <option value="">请选择时辰</option>
                {hours.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 性别选择 */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-bazi-gold" />
                性别
              </label>
              <div className="flex gap-2">
                {(['male', 'female'] as const).map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ gender })}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-300 ${
                      formData.gender === gender
                        ? 'bg-bazi-gold/20 border-bazi-gold text-bazi-gold'
                        : 'bg-bazi-bg/50 border-bazi-border text-bazi-muted hover:border-bazi-gold/50'
                    }`}
                  >
                    {gender === 'male' ? '男' : '女'}
                  </button>
                ))}
              </div>
            </div>

            {/* 高级选项 */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-bazi-muted hover:text-bazi-gold transition-colors"
              >
                <Settings className="w-4 h-4" />
                高级选项
                <span className="text-xs">
                  {showAdvanced ? '▲' : '▼'}
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-bazi-bg/50 rounded-lg border border-bazi-border animate-fade-in">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.useTrueSolarTime}
                      onChange={(e) =>
                        setFormData({ useTrueSolarTime: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-bazi-border bg-bazi-bg checked:bg-bazi-gold focus:ring-2 focus:ring-bazi-gold/20"
                    />
                    <div>
                      <div className="text-sm font-medium">使用真太阳时</div>
                      <div className="text-xs text-bazi-muted">
                        基于 NOAA 标准计算，更精确的时辰判定
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* 提交按钮 */}
            <Button type="submit" className="w-full" size="lg">
              生成八字报告
            </Button>
          </form>

          {/* 底部提示 */}
          <p className="text-center text-xs text-bazi-muted mt-6">
            您的隐私受到保护，所有数据仅用于八字分析
          </p>
        </div>
      </div>

      {/* Toast 提示 */}
      {showToast && (
        <Toast
          message="表单提交成功！正在生成八字报告..."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
