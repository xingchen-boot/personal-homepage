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
- 个人简历页（对齐真实履历：实习 / 项目 / 技能 / 荣誉，支持打印导出 PDF、页内锚点）
- 项目作品集页 + 首页精选项目预览
- 简历向深度技术文章（CSS 下沉 / 虚拟列表 / AI Agent）
- RSS / Sitemap、阅读量与热门文章、相关推荐
- 评论蜜罐 + 频率限制防刷
- 后端不可用时自动回退本地示例文章
- 关于页与联系方式
- 明暗主题切换（支持自动模式）
- 中文 / English / 日本語 多语言切换
- 评论系统
- 亮色樱花 / 暗色 WebGL 星空（Three.js，可开关，自动降级 2D）
- 本地问答助手（无 API Key；3D 气泡可摸头互动，「问我」才开对话）
- 技术文章加深度正文与配图（架构 SVG + 封面图）
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
