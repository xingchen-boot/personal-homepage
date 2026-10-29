/**
 * 简历向深度技术文章（Pi 精读章法）
 * 正文拆在 articles/teach/，便于单篇迭代。
 */
import { cssSinkingContent } from './articles/teach/cssSinking.js'
import { virtualListContent } from './articles/teach/virtualList.js'
import { frontcodeAgentContent } from './articles/teach/frontcodeAgent.js'

export const resumeArticles = [
  {
    id: 'css-runtime-sinking',
    title: '从 Electron 到 Qt：CSS 下沉链路怎么打通',
    date: '2026-06-12',
    category: '性能优化',
    summary:
      '腾讯实习精读复盘：问题贵在哪、cssMap 编译期契约、窗级共享、脏集增量、Profiling 与迁移纪律——按概念→模型→自检写透。',
    content: cssSinkingContent,
    tags: ['CSS Runtime', 'Qt', '性能优化', '腾讯实习'],
  },
  {
    id: 'virtual-list-streaming',
    title: '万级列表与流式 AI：两段前端性能实战',
    date: '2026-01-20',
    category: '性能优化',
    summary:
      '虚拟列表窗口模型、缓冲带、流式锚定、节点回收与 Worker 分工；读完能自己实现可用窗口，而不只会调组件。',
    content: virtualListContent,
    tags: ['虚拟列表', 'EventSource', 'Web Worker', '性能优化'],
  },
  {
    id: 'frontcode-ai-agent',
    title: 'FrontCode：做一个类 Claude Code 的终端 Agent',
    date: '2026-04-08',
    category: 'AI',
    summary:
      '三种大模型用法 → Trace/Turn → 一条消息的旅程 → MCP/Skill/RAG/权限；对照 Pi 与 dsh 精读，真正学会 Agent 运行时。',
    content: frontcodeAgentContent,
    tags: ['AI Agent', 'MCP', 'RAG', 'Node.js'],
  },
]
