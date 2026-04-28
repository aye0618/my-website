'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Users, FileText, TrendingUp, Activity } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 1234,
    totalRecords: 5678,
    todayAnalysis: 89,
    activeUsers: 456,
  })

  useEffect(() => {
    // 验证登录状态
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const statCards = [
    {
      icon: Users,
      label: '总用户数',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: FileText,
      label: '总占卜记录',
      value: stats.totalRecords.toLocaleString(),
      change: '+8.3%',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: TrendingUp,
      label: '今日分析',
      value: stats.todayAnalysis.toLocaleString(),
      change: '+23.1%',
      color: 'text-bazi-gold',
      bgColor: 'bg-bazi-gold/10',
    },
    {
      icon: Activity,
      label: '活跃用户',
      value: stats.activeUsers.toLocaleString(),
      change: '+5.7%',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
            仪表盘
          </h1>
          <p className="text-bazi-muted">
            欢迎回来，这是您的数据概览
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                className="bg-bazi-card border border-bazi-border rounded-xl p-6 hover:border-bazi-gold transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <span className="text-sm text-green-500 font-medium">
                    {card.change}
                  </span>
                </div>
                <p className="text-bazi-muted text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-bazi-text">{card.value}</p>
              </div>
            )
          })}
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 用户增长趋势 */}
          <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-bazi-text mb-4">
              用户增长趋势
            </h3>
            <div className="h-64 flex items-center justify-center text-bazi-muted">
              <p>图表占位 - 可集成 Chart.js 或 Recharts</p>
            </div>
          </div>

          {/* 占卜类型分布 */}
          <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-bazi-text mb-4">
              占卜类型分布
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-bazi-text">八字排盘</span>
                  <span className="text-bazi-gold font-medium">65%</span>
                </div>
                <div className="w-full h-2 bg-bazi-bg rounded-full overflow-hidden">
                  <div className="h-full bg-bazi-gold rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-bazi-text">易经占卜</span>
                  <span className="text-blue-500 font-medium">35%</span>
                </div>
                <div className="w-full h-2 bg-bazi-bg rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-bazi-card border border-bazi-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-bazi-text mb-4">
            最近活动
          </h3>
          <div className="space-y-4">
            {[
              { user: '用户1234', action: '完成了八字排盘分析', time: '5分钟前' },
              { user: '用户5678', action: '进行了易经占卜', time: '12分钟前' },
              { user: '用户9012', action: '注册了新账号', time: '25分钟前' },
              { user: '用户3456', action: '完成了八字排盘分析', time: '1小时前' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-bazi-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bazi-gold/20 flex items-center justify-center">
                    <span className="text-bazi-gold text-sm font-bold">
                      {activity.user.slice(-2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-bazi-text font-medium">{activity.user}</p>
                    <p className="text-sm text-bazi-muted">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-bazi-muted">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
