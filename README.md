# 八字命理 AI 分析平台

千年命理智慧 × DeepSeek AI 深度解读

## 功能特性

- 🔮 **八字排盘**: AI 智能分析生辰八字
- 📿 **易经占卜**: 传统铜钱卜卦,AI 解读卦象
- 👤 **用户系统**: 登录注册,个人信息管理
- 🎨 **精美界面**: 金色主题,太极八卦背景
- 📱 **响应式设计**: 完美适配桌面端和移动端

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **状态管理**: Zustand

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000

## 部署

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

推荐使用 Vercel 一键部署,免费且自动化。

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── admin/             # 后台管理系统
│   ├── api/               # API 路由
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── admin/            # 后台组件
│   ├── AuthModal.tsx     # 登录注册弹窗
│   ├── ChatInterface.tsx # 八字排盘界面
│   ├── YijingInterface.tsx # 易经占卜界面
│   └── ...
├── lib/                   # 工具函数
├── store/                 # 状态管理
└── public/               # 静态资源
```

## 环境变量

创建 `.env.local` 文件:

```env
# API 配置
NEXT_PUBLIC_API_URL=https://baziapi.site
NEXT_PUBLIC_PROXY_URL=https://anynetgate.cn/?
```

## License

MIT
