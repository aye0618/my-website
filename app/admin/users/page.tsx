'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Search, Filter, MoreVertical, Ban, CheckCircle } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  status: 'active' | 'banned'
  registerDate: string
  lastLogin: string
  analysisCount: number
}

export default function AdminUsers() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: '用户1234',
      email: 'user1234@example.com',
      status: 'active',
      registerDate: '2026-04-01',
      lastLogin: '2026-04-28 10:30',
      analysisCount: 15,
    },
    {
      id: '2',
      username: '用户5678',
      email: 'user5678@example.com',
      status: 'active',
      registerDate: '2026-04-05',
      lastLogin: '2026-04-27 18:45',
      analysisCount: 8,
    },
    {
      id: '3',
      username: '用户9012',
      email: 'user9012@example.com',
      status: 'banned',
      registerDate: '2026-03-20',
      lastLogin: '2026-04-20 14:20',
      analysisCount: 3,
    },
  ])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
          : user
      )
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
              用户管理
            </h1>
            <p className="text-bazi-muted">
              管理平台用户，查看用户详情
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
              placeholder="搜索用户名或邮箱..."
              className="w-full pl-10 pr-4 py-3 bg-bazi-card border border-bazi-border rounded-lg focus:border-bazi-gold focus:outline-none transition-all"
            />
          </div>
          <button className="px-4 py-3 bg-bazi-card border border-bazi-border hover:border-bazi-gold rounded-lg transition-all flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>筛选</span>
          </button>
        </div>

        {/* 用户列表 */}
        <div className="bg-bazi-card border border-bazi-border rounded-xl overflow-hidden">
          {/* 表头 */}
          <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-4 bg-bazi-bg border-b border-bazi-border text-sm font-medium text-bazi-muted">
            <div>用户名</div>
            <div className="col-span-2">邮箱</div>
            <div>状态</div>
            <div>注册日期</div>
            <div>分析次数</div>
            <div className="text-right">操作</div>
          </div>

          {/* 表格内容 */}
          <div className="divide-y divide-bazi-border">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-4 hover:bg-bazi-bg/50 transition-colors"
              >
                {/* 移动端布局 */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-bazi-text">{user.username}</p>
                      <p className="text-sm text-bazi-muted">{user.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {user.status === 'active' ? '正常' : '已封禁'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-bazi-muted">注册: {user.registerDate}</span>
                    <span className="text-bazi-gold font-medium">{user.analysisCount} 次分析</span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="w-full px-4 py-2 bg-bazi-bg border border-bazi-border hover:border-bazi-gold rounded-lg transition-all text-sm"
                  >
                    {user.status === 'active' ? '封禁用户' : '解除封禁'}
                  </button>
                </div>

                {/* 桌面端布局 */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bazi-gold/20 flex items-center justify-center">
                      <span className="text-bazi-gold font-bold">
                        {user.username.slice(-2)}
                      </span>
                    </div>
                    <span className="font-medium text-bazi-text">{user.username}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center col-span-2">
                  <span className="text-bazi-text">{user.email}</span>
                </div>
                <div className="hidden md:flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {user.status === 'active' ? '正常' : '已封禁'}
                  </span>
                </div>
                <div className="hidden md:flex items-center">
                  <span className="text-bazi-muted text-sm">{user.registerDate}</span>
                </div>
                <div className="hidden md:flex items-center">
                  <span className="text-bazi-gold font-medium">{user.analysisCount}</span>
                </div>
                <div className="hidden md:flex items-center justify-end">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="p-2 hover:bg-bazi-border rounded-lg transition-colors"
                    title={user.status === 'active' ? '封禁用户' : '解除封禁'}
                  >
                    {user.status === 'active' ? (
                      <Ban className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-bazi-muted">未找到匹配的用户</p>
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-bazi-muted">
            共 {users.length} 个用户
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
