'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Save, Globe, Database, Bell, Shield } from 'lucide-react'

export default function AdminSettings() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    siteName: '八字命理 AI 分析平台',
    siteDescription: '千年命理智慧 × DeepSeek AI 深度解读',
    apiUrl: 'https://baziapi.site',
    proxyUrl: 'https://anynetgate.cn/?',
    enableRegistration: true,
    enableNotifications: true,
    maxAnalysisPerDay: 10,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: 调用保存设置 API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('设置已保存')
    } catch (error) {
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
              系统设置
            </h1>
            <p className="text-bazi-muted">
              配置网站和 API 参数
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold text-bazi-bg font-bold rounded-xl shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.7)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? '保存中...' : '保存设置'}
          </button>
        </div>

        {/* 网站配置 */}
        <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-bazi-gold/20 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-bazi-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-bazi-text">网站配置</h3>
              <p className="text-sm text-bazi-muted">基本网站信息设置</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                网站名称
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-bazi-bg border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                网站描述
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-bazi-bg border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* API 配置 */}
        <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-bazi-text">API 配置</h3>
              <p className="text-sm text-bazi-muted">八字分析 API 设置</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                API 地址
              </label>
              <input
                type="text"
                value={settings.apiUrl}
                onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                className="w-full px-4 py-3 bg-bazi-bg border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
              />
              <p className="text-xs text-bazi-muted mt-2">
                八字分析 API 的基础地址
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                跨域代理地址
              </label>
              <input
                type="text"
                value={settings.proxyUrl}
                onChange={(e) => setSettings({ ...settings, proxyUrl: e.target.value })}
                className="w-full px-4 py-3 bg-bazi-bg border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
              />
              <p className="text-xs text-bazi-muted mt-2">
                AnyNetGate 跨域代理服务地址
              </p>
            </div>
          </div>
        </div>

        {/* 功能配置 */}
        <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-bazi-text">功能配置</h3>
              <p className="text-sm text-bazi-muted">平台功能开关和限制</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-bazi-bg rounded-lg">
              <div>
                <p className="font-medium text-bazi-text">开放注册</p>
                <p className="text-sm text-bazi-muted">允许新用户注册账号</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-bazi-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bazi-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bazi-gold"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-bazi-bg rounded-lg">
              <div>
                <p className="font-medium text-bazi-text">通知功能</p>
                <p className="text-sm text-bazi-muted">启用系统通知推送</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-bazi-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bazi-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bazi-gold"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-bazi-text mb-2">
                每日分析次数限制
              </label>
              <input
                type="number"
                value={settings.maxAnalysisPerDay}
                onChange={(e) => setSettings({ ...settings, maxAnalysisPerDay: parseInt(e.target.value) || 0 })}
                min="1"
                max="100"
                className="w-full px-4 py-3 bg-bazi-bg border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
              />
              <p className="text-xs text-bazi-muted mt-2">
                每个用户每天最多可进行的分析次数
              </p>
            </div>
          </div>
        </div>

        {/* 保存按钮 (移动端) */}
        <div className="md:hidden">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-6 py-4 bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold text-bazi-bg font-bold rounded-xl shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
