/**
 * 项目作品集数据（对齐简历中的项目与实习亮点）
 * 供 /projects 页面与首页预览复用
 *
 * case 字段：problem / result / writeupId —— 方便首页做成「问题→结果→复盘」迷你 case
 */
export const projectList = [
  {
    id: 'pi-agent-notes',
    name: 'Pi Agent 阅读指南',
    period: '2026 — 至今',
    role: '个人笔记 · 源码精读',
    summary:
      '基于 earendil-works/pi 的双轨精读：源码内部构造 + 实战上手，本地 Astro 站点 /mine 呈现（星辰笔记副本）。',
    problem: '读开源 Agent 容易停在概念名词，缺一条可对照的源码路径。',
    result: '本地精读站双轨呈现，可与 dsh 对照两种 harness 哲学。',
    highlights: [
      '覆盖 Agent Loop、工具、会话、压缩、上下文工程等章节',
      '实战轨：环境、模型配置、System Prompt、部署',
      '与 dsh 精读同站，便于对照两种 harness 哲学',
    ],
    tags: ['Pi Agent', '源码精读', 'Agent', 'Astro'],
    link: 'http://127.0.0.1:4321/mine/',
    linkLabel: '本机笔记',
    localOnly: true,
    metric: '本地精读站 · /mine',
  },
  {
    id: 'dsh-notes',
    name: 'dsh 源码精读（DeepSeek Harness）',
    period: '2026 — 至今',
    role: '个人笔记 · 源码精读',
    summary:
      '对照真实 deepseek-harness 源码撰写的阅读指南：一切皆插件、Cordis、Session 不变量与壳层组装。',
    problem: 'Harness「一切皆插件」难建立心智模型，需要按章拆壳。',
    result: '从开篇到 agent-loop / tools / session 的可读路径。',
    highlights: [
      '从「没有内核的外壳」开篇，按章拆 agent-loop / tools / session',
      '与 Pi 精读同站双轨，强调可替换循环 vs 插件运行时',
      '笔记站点本地地址：/modules/dsh-ch01 起',
    ],
    tags: ['dsh', 'DeepSeek Harness', 'Cordis', '源码精读'],
    link: 'http://127.0.0.1:4321/modules/dsh-ch01',
    linkLabel: '本机笔记',
    localOnly: true,
    metric: '本地精读站 · dsh 轨',
  },
  {
    id: 'frontcode',
    name: 'FrontCode — AI 终端智能助手',
    period: '2026.03 — 至今',
    role: '个人项目 · 全栈',
    summary:
      '基于 Node.js + OpenAI SDK 的终端 AI Agent，支持工具调用、Skill 扩展、MCP 协议与 RAG 检索，类 Claude Code 架构。',
    problem: '调一次 Chat API 不够用——需要可循环、可插拔工具、有权限边界的运行时。',
    result: '自研 Tool Agent Loop + MCP/Skill/RAG，可当日常开发助手骨架。',
    highlights: [
      'Tool Agent 循环调度：决策 → 本地工具执行 → 结果回传',
      'MCP 动态加载外部工具，能力热插拔',
      'LanceDB 向量检索 + 跨会话记忆',
      '指令 / 文件 / 图片多模态快捷输入',
    ],
    tags: ['Node.js', 'OpenAI SDK', 'MCP', 'RAG', 'Agent'],
    link: 'https://github.com/xingchen-boot',
    linkLabel: 'GitHub',
    writeupId: 'frontcode-ai-agent',
    metric: '类 Claude Code 终端 Agent',
  },
  {
    id: 'wenjuanyi',
    name: '问卷易 — 问卷调查管理系统',
    period: '校团队全栈开发',
    role: '前端主力',
    summary:
      'Vue.js + Element UI 问卷系统，覆盖创建、分发、收集与分析，含模板库与积分机制。',
    problem: '校内问卷从创建到分析链路长，需要可上线的前后端一体方案。',
    result: '已上线可访问；JWT 鉴权 + 懒加载分页支撑列表性能。',
    highlights: [
      'Vuex 集中管理问卷编辑态，Axios 统一拦截',
      'JWT + 路由守卫 + 权限指令',
      '懒加载与分页优化列表性能',
      'Nginx 反向代理解决跨域并上线',
    ],
    tags: ['Vue', 'Element UI', 'Vuex', 'JWT', 'Nginx'],
    link: 'https://wj.denglu1.cn/',
    linkLabel: '在线体验',
    metric: '已上线可访问',
  },
  {
    id: 'tencent-css',
    name: 'PC QQ CSS 下沉架构（腾讯实习）',
    period: '2026.05 — 至今',
    role: '前端开发实习生',
    summary:
      '参与 Electron → Qt 原生渲染的 CSS 下沉链路，建设运行时样式引擎与性能评测体系。',
    problem: 'Electron → Qt 迁移时样式贵在哪、如何窗级共享与增量更新。',
    result: '650 节点冷挂载 44.859s → 378ms（约 118×），选择器解析 -99%。',
    highlights: [
      '打通 Vue SFC → cssMap → Qt StyleEngine 全链路',
      '选择器索引、权重、scoped、伪类与 CSS 变量解析',
      '650 节点冷挂载 44.859s → 378ms，解析次数 -99%',
      '主题 Token 增量刷新，避免全窗口重算',
    ],
    tags: ['Vue SFC', 'Qt', 'CSS Runtime', 'Profiling'],
    link: '',
    writeupId: 'css-runtime-sinking',
    metric: '冷挂载优化约 118×',
  },
  {
    id: '37-cs',
    name: '海外客服后台（三七互娱实习）',
    period: '2026.02 — 2026.05',
    role: '前端开发实习生',
    summary:
      'Vue3 + TypeScript 海外多平台运营客服后台，解决轮询卡顿、聊天虚拟滚动与富文本扩展。',
    problem: '主线程轮询卡顿 + 聊天记录双向加载跳动。',
    result: 'Worker 轮询与双向虚拟滚动差值补偿，支撑多平台并行迭代。',
    highlights: [
      'Web Worker 异步轮询，主线程任务注册联调',
      '双向虚拟滚动 + scrollTop 差值补偿',
      'TinyMCE 插件：图片、引用、Lottie 贴纸',
    ],
    tags: ['Vue3', 'TypeScript', 'Web Worker', 'TinyMCE'],
    link: '',
    metric: '多平台并行迭代支撑',
  },
  {
    id: 'telecom-procuratorate',
    name: '检察政务管理系统（电信实习）',
    period: '2025.09 — 2025.12',
    role: '前端开发实习生',
    summary:
      '广东省检察院政务系统前端，覆盖案件、会议、AI 工具等模块，服务千余名检察人员。',
    problem: '万级列表卡顿、大模型回答首屏慢、大批量文书上传失败率高。',
    result: 'DOM ~30 节点、流式首屏 0.8s、批量上传 5 分钟 → 30 秒。',
    highlights: [
      '自研虚拟列表：DOM 万级 → ~30，内存 800MB → 280MB',
      'EventSource 流式 AI 问答，首屏 3s → 0.8s',
      '分片上传引擎：批量文书 5 分钟 → 30 秒，成功率 99.8%',
    ],
    tags: ['虚拟列表', 'EventSource', '分片上传', '性能优化'],
    link: '',
    writeupId: 'virtual-list-streaming',
    metric: '滚动帧率 ≥ 55fps',
  },
]
