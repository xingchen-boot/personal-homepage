# Xingchen's Blog

个人博客，记录前端学习与技术实践。

## 技术栈

**前端：**
- Vue 3 + Vite
- Vue Router
- 原生 CSS（主题切换、响应式布局）

**后端：**
- Node.js + Express
- MySQL 8
- mysql2

## 功能

- 文章列表、详情、归档、标签筛选
- 明暗主题切换（支持自动模式）
- 中文 / English / 日本語 多语言切换
- 评论系统
- 樱花 / 星空背景动画
- 响应式布局，适配移动端

## 项目结构

```
personal-homepage/
├── src/
│   ├── api/              # API 请求封装
│   ├── assets/           # 图片资源
│   ├── components/       # 公共组件
│   ├── composables/      # 组合式函数（主题、国际化）
│   ├── data/             # 静态数据
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── styles/           # 全局样式、CSS 变量
│   └── views/            # 页面组件
├── server/
│   ├── routes/           # API 路由
│   ├── db.js             # 数据库连接
│   ├── index.js          # 服务入口
│   └── init.sql          # 建表与初始数据
└── vite.config.js
```

## 快速开始

### 1. 数据库

使用 Navicat 或命令行导入建表脚本：

```bash
mysql -u root -p < server/init.sql
```

如需更多测试数据：

```bash
mysql -u root -p personal_blog < server/seed-more.sql
```

### 2. 后端

```bash
cd server
cp .env.example .env    # 修改数据库密码
npm install
npm run dev
```

服务运行在 http://localhost:3001

### 3. 前端

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 环境变量

在 `server/.env` 中配置：

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=personal_blog
SERVER_PORT=3001
```

## License

MIT
