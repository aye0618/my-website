'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Search, Filter, Eye } from 'lucide-react'

interface Record {
  id: string
  userId: string
  username: string
  type: 'bazi' | 'yijing'
  content: string
  createdAt: string
  duration: string
}

export default function AdminRecords() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'bazi' | 'yijing'>('all')
  const [records, setRecords] = useState<Record[]>([
    {
      id: '1',
      userId: '1',
      username: '用户1234',
      type: 'bazi',
      content: '1995-08-20 14:00 女',
      createdAt: '2026-04-28 10:30',
      duration: '76.9秒',
    },
    {
      id: '2',
      userId: '2',
      username: '用户5678',
      type: 'yijing',
      content: '我和恋人最近经常争吵，这段关系还会长久吗？',
      createdAt: '2026-04-28 09:15',
      duration: '5.2秒',
    },
    {
      id: '3',
      userId: '1',
      username: '用户1234',
      type: 'bazi',
      content: '1988-03-12 08:30 男',
      createdAt: '2026-04-27 18:45',
      duration: '82.1秒',
    },
    {
      id: '4',
      userId: '3',
      username: '用户9012',
      type: 'yijing',
      content: '我应该接受这份新工作offer吗？',
      createdAt: '2026-04-27 16:20',
      duration: '4.8秒',
    },
  ])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || record.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
              占卜记录
            </h1>
            <p className="text-bazi-muted">
              查看所有用户的占卜记录
            </p>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bazi-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户名或内容..."
              className="w-full pl-10 pr-4 py-3 bg-bazi-card border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-3 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-bazi-gold text-bazi-bg'
                  : 'bg-bazi-card border border-bazi-border hover:border-bazi-gold'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('bazi')}
              className={`px-4 py-3 rounded-lg transition-all ${
                filterType === 'bazi'
                  ? 'bg-bazi-gold text-bazi-bg'
                  : 'bg-bazi-card border border-bazi-border hover:border-bazi-gold'
              }`}
            >
              八字排盘
            </button>
            <button
              onClick={() => setFilterType('yijing')}
              className={`px-4 py-3 rounded-lg transition-all ${
                filterType === 'yijing'
                  ? 'bg-bazi-gold text-bazi-bg'
                  : 'bg-bazi-card border border-bazi-border hover:border-bazi-gold'
              }`}
            >
              易经占卜
            </button>
          </div>
        </div>

        {/* 记录列表 */}
        <div className="bg-bazi-card border border-bazi-border rounded-xl overflow-hidden">
          {/* 表头 */}
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 bg-bazi-bg border-b border-bazi-border text-sm font-medium text-bazi-muted">
            <div>用户</div>
            <div>类型</div>
            <div className="col-span-2">内容</div>
            <div>时间</div>
            <div className="text-right">操作</div>
          </div>

          {/* 表格内容 */}
          <div className="divide-y divide-bazi-border">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-bazi-bg/50 transition-colors"
              >
                {/* 移动端布局 */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-bazi-gold/20 flex items-center justify-center">
                        <span className="text-bazi-gold text-xs font-bold">
                          {record.username.slice(-2)}
                        </span>
                      </div>
                      <span className="font-medium text-bazi-text">{record.username}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.type === 'bazi'
                          ? 'bg-bazi-gold/20 text-bazi-gold'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}
                    >
                      {record.type === 'bazi' ? '八字排盘' : '易经占卜'}
                    </span>
                  </div>
                  <p className="text-sm text-bazi-text line-clamp-2">{record.content}</p>
                  <div className="flex items-center justify-between text-xs text-bazi-muted">
                    <span>{record.createdAt}</span>
                    <span>耗时: {record.duration}</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-bazi-bg border border-bazi-border hover:border-bazi-gold rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    查看详情
                  </button>
                </div>

                {/* 桌面端布局 */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bazi-gold/20 flex items-center justify-center">
                      <span className="text-bazi-gold font-bold">
                        {record.username.slice(-2)}
                      </span>
                    </div>
                    <span className="font-medium text-bazi-text">{record.username}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.type === 'bazi'
                        ? 'bg-bazi-gold/20 text-bazi-gold'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}
                  >
                    {record.type === 'bazi' ? '八字排盘' : '易经占卜'}
                  </span>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                  <p className="text-bazi-text line-clamp-2">{record.content}</p>
                </div>
                <div className="hidden md:flex flex-col justify-center">
                  <span className="text-bazi-text text-sm">{record.createdAt}</span>
                  <span className="text-bazi-muted text-xs">耗时: {record.duration}</span>
                </div>
                <div className="hidden md:flex items-center justify-end">
                  <button className="p-2 hover:bg-bazi-border rounded-lg transition-colors" title="查看详情">
                    <Eye className="w-5 h-5 text-bazi-gold" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredRecords.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-bazi-muted">未找到匹配的记录</p>
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-bazi-muted">
            共 {filteredRecords.length} 条记录
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-bazi-card border border-bazi-border hover:border-bazi-gold rounded-lg transition-all text-sm">
              上一页
            </button>
            <button className="px-4 py-2 bg-bazi-gold text-bazi-bg rounded-lg transition-all text-sm">
              1
            </button>
            <button className="px-4 py-2 bg-bazi-card border border-bazi-border hover:border-bazi-gold rounded-lg transition-all text-sm">
              下一页
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
