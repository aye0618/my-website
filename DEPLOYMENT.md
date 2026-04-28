# 部署指南

## 方案一: Vercel 部署 (推荐)

### 1. 初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. 推送到 GitHub

1. 在 GitHub 创建新仓库
2. 推送代码:
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 3. 部署到 Vercel

1. 访问 https://vercel.com
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 点击 "Deploy" (无需配置,自动识别 Next.js)
5. 等待部署完成 (约 2-3 分钟)

### 4. 绑定腾讯云域名

#### 在 Vercel 添加域名:
1. 进入项目 Settings → Domains
2. 添加你的域名,例如: `www.yourdomain.com`
3. Vercel 会给你一个 CNAME 记录值,例如: `cname.vercel-dns.com`

#### 在腾讯云 DNS 配置:
1. 登录腾讯云控制台
2. 进入 DNS 解析
3. 添加记录:
   - 记录类型: CNAME
   - 主机记录: www (或 @)
   - 记录值: `cname.vercel-dns.com` (Vercel 提供的)
   - TTL: 600

4. 等待 DNS 生效 (5-10 分钟)
5. 回到 Vercel,点击 "Verify" 验证域名

---

## 方案二: 腾讯云服务器部署

### 前置要求:
- 腾讯云服务器 (CVM)
- 已安装 Node.js 18+
- 已安装 Nginx

### 1. 构建项目

```bash
npm run build
```

### 2. 上传到服务器

使用 FTP/SFTP 工具上传整个项目文件夹到服务器,例如:
```
/var/www/bazi-ai/
```

### 3. 在服务器上安装依赖并启动

```bash
cd /var/www/bazi-ai
npm install --production
npm run start
```

### 4. 配置 Nginx 反向代理

创建 Nginx 配置文件: `/etc/nginx/sites-available/bazi-ai`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置:
```bash
sudo ln -s /etc/nginx/sites-available/bazi-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. 配置 PM2 (保持进程运行)

```bash
npm install -g pm2
pm2 start npm --name "bazi-ai" -- start
pm2 save
pm2 startup
```

### 6. 配置 SSL (HTTPS)

使用 Let's Encrypt 免费证书:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 方案三: 腾讯云 Serverless (Webify)

### 1. 安装腾讯云 CLI

```bash
npm install -g @cloudbase/cli
```

### 2. 登录腾讯云

```bash
cloudbase login
```

### 3. 初始化项目

```bash
cloudbase init
```

### 4. 部署

```bash
cloudbase framework deploy
```

---

## 推荐方案对比

| 方案 | 难度 | 费用 | 性能 | 推荐度 |
|------|------|------|------|--------|
| Vercel | ⭐ 简单 | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 腾讯云服务器 | ⭐⭐⭐ 中等 | 约 ¥100/月 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 腾讯云 Serverless | ⭐⭐ 简单 | 按量计费 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**建议: 先用 Vercel 部署,免费且简单,后续如果需要再迁移到腾讯云。**
