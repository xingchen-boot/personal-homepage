/**
 * 本地 Agent 知识库（无 API Key）
 * 每条包含：标题、正文、关键词、可选站内跳转
 */
export const agentKnowledge = [
  {
    id: 'profile',
    title: '个人简介',
    keywords: ['你是谁', '介绍', '自己', '林昭南', '星辰', '姓名', '谁', '简介', 'about'],
    text: '我是林昭南，博客昵称「星辰」。广东工业大学计算机科学与技术在读（2023—2027），GPA 4.0/5.0（前 10%），目前是腾讯前端开发实习生，关注 Vue 生态、性能优化与 AI Agent。',
    link: '/about',
    linkLabel: '关于页',
  },
  {
    id: 'edu',
    title: '教育背景',
    keywords: ['学校', '教育', '广工', '广东工业', 'GPA', '学历', '专业', '计科', '奖学金', '四级', '六级', 'CET'],
    text: '就读于广东工业大学（全日制本科）计算机科学与技术，GPA 4.0/5.0（前 10%），获一等奖学金，通过 CET-4/CET-6；另有数模省一、蓝桥杯省二等荣誉。',
    link: '/resume#education',
    linkLabel: '简历 · 教育',
  },
  {
    id: 'tencent',
    title: '腾讯实习',
    keywords: ['腾讯', 'QQ', 'Electron', 'Qt', 'CSS下沉', '样式引擎', '冷挂载', 'StyleEngine', '实习', '腾讯科技'],
    text: '2026.05 至今在腾讯科技（深圳）做前端实习，参与 PC QQ Electron→Qt 原生渲染的 CSS 下沉架构：打通 Vue SFC→cssMap→Qt StyleEngine 链路，建设选择器/权重/scoped/变量等运行时能力；650 节点调试页冷挂载约从 44.859s 降到 378ms，选择器解析次数约降 99%。',
    link: '/resume#experience',
    linkLabel: '简历 · 实习',
  },
  {
    id: '37',
    title: '三七互娱实习',
    keywords: ['三七', '互娱', '客服', 'Worker', '虚拟滚动', 'TinyMCE', '富文本', '海外'],
    text: '2026.02—2026.05 在三七互娱做前端实习，参与海外多平台运营客服后台（Vue3+TS）：Web Worker 异步轮询、聊天双向虚拟滚动与 scrollTop 补偿，以及 TinyMCE 图片/引用/Lottie 等插件。',
    link: '/resume#experience',
    linkLabel: '简历 · 实习',
  },
  {
    id: 'telecom',
    title: '电信实习',
    keywords: ['电信', '检察', '虚拟列表', '流式', 'EventSource', '分片上传', '文书', 'AI问答'],
    text: '2025.09—2025.12 在中国电信（广州）做前端实习，参与广东省检察院政务系统：自研虚拟列表把 DOM 从万级降到约 30、内存约 800MB→280MB；EventSource 流式 AI 问答首屏约 3s→0.8s；大文件分片上传批量文书约 5 分钟→30 秒。',
    link: '/resume#experience',
    linkLabel: '简历 · 实习',
  },
  {
    id: 'frontcode',
    title: 'FrontCode 项目',
    keywords: ['FrontCode', 'Agent', 'MCP', 'RAG', 'LanceDB', '终端', 'Claude', '工具调用', 'Skill'],
    text: 'FrontCode 是我的个人终端 AI Agent 项目（Node.js + OpenAI SDK），支持 Tool Agent 循环、MCP 热插拔、Markdown Skill 扩展，以及 LanceDB 向量检索与跨会话记忆，类 Claude Code 架构。',
    link: '/projects',
    linkLabel: '项目作品集',
  },
  {
    id: 'wenjuanyi',
    title: '问卷易项目',
    keywords: ['问卷', '问卷易', 'Element', 'Vuex', 'JWT', 'Nginx'],
    text: '问卷易是校团队问卷调查系统，我主要做前端：Vue + Element UI、Vuex 编辑态、JWT 权限与 Nginx 部署，线上地址可在作品集访问。',
    link: '/projects',
    linkLabel: '项目作品集',
  },
  {
    id: 'skills',
    title: '专业技能',
    keywords: ['技能', '技术栈', '会什么', 'Vue', 'TypeScript', 'Vite', 'Webpack', '熟悉'],
    text: '前端以 Vue2/3 全家桶为主，熟悉工程化（Vite/Webpack）、性能优化（虚拟列表、Worker、Profiling）；AI 方向熟悉 OpenAI SDK、Function Calling、MCP、RAG；也接触 Electron/Qt 客户端渲染链路与 JS/TS、HTTP、浏览器原理。',
    link: '/resume#skills',
    linkLabel: '简历 · 技能',
  },
  {
    id: 'awards',
    title: '荣誉奖项',
    keywords: ['奖', '荣誉', '数模', '蓝桥杯', '数学竞赛', '奖学金'],
    text: '荣誉包括：广东省大学生数学建模大赛省级一等奖、蓝桥杯省级二等奖、全国大学生数学竞赛省级三等奖、校级一等奖学金等。',
    link: '/resume#awards',
    linkLabel: '简历 · 荣誉',
  },
  {
    id: 'contact',
    title: '联系方式',
    keywords: ['联系', '邮箱', '邮件', 'email', '合作', '简历', '招人'],
    text: '公开联系方式是邮箱 3141163409@qq.com；完整履历见站点「简历」页（不公开电话）。也欢迎通过 GitHub xingchen-boot 交流。',
    link: '/resume',
    linkLabel: '个人简历',
  },
  {
    id: 'blog',
    title: '这个网站',
    keywords: ['博客', '网站', '主页', '技术栈', '怎么做的', 'Vue', '这个站'],
    text: '本站是「星辰」的个人主页：Vue3 + Vite 前端，Express + MySQL 后端；文章按 Pi 精读章法写（概念→对照表→自检），覆盖 CSS 下沉、虚拟列表、FrontCode Agent、MCP、async/await 等；另有简历、作品集、WebGL 星空与本地问答助手。',
    link: '/',
    linkLabel: '回到首页',
  },
  {
    id: 'pi-agent-notes',
    title: 'Pi Agent 阅读指南',
    keywords: ['pi', 'pi-agent', 'Pi Agent', '阅读指南', '源码精读', 'earendil', 'harness'],
    text: '我写了 Pi Agent（earendil-works/pi）的源码精读与实战笔记：入口在本站「友链 → 我的源码精读」（笔记站仅本机 4321 可开）；上游仓库 https://github.com/earendil-works/pi 。',
    link: '/links',
    linkLabel: '友链 · 源码精读',
  },
  {
    id: 'dsh-notes',
    title: 'dsh 源码精读',
    keywords: ['dsh', 'deepseek', 'harness', 'DeepSeek Harness', 'Cordis', '源码', '精读'],
    text: '我写了 DeepSeek Harness（dsh）源码精读：入口在本站「友链 → 我的源码精读」（笔记站仅本机 4321 可开）；上游 https://github.com/deepseek-ai/deepseek-harness ，官方文档 https://deepseek-harness.github.io/deepseek-harness/ 。',
    link: '/links',
    linkLabel: '友链 · 源码精读',
  },
]

/** 快捷提问（展示在对话面板） */
export const agentSuggestedQuestions = [
  '你是谁？',
  '腾讯实习做什么？',
  '有哪些项目？',
  'Pi Agent 阅读指南在哪？',
  'dsh 源码精读呢？',
]
