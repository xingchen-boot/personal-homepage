export const blogList = [
  {
    id: 'css-horizontal-scroll',
    title: 'CSS实现横向滚动布局',
    date: '2025-03-15',
    category: 'CSS',
    summary: '介绍几种CSS实现横向滚动布局的方法，包括overflow-x、flex布局和scroll-snap等方案。',
    content: `
## 前言

在实际开发中，我们经常会遇到需要横向滚动的场景，比如图片轮播、商品列表等。本文将介绍几种常见的实现方式。

## 方案一：overflow-x + flex

最简单的方案是使用 flex 布局配合 overflow-x。

\`\`\`css
.scroll-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.scroll-item {
  flex-shrink: 0;
  width: 300px;
  scroll-snap-align: start;
}
\`\`\`

## 方案二：scroll-snap

scroll-snap 可以让滚动更有"吸附感"，用户体验更好。

\`\`\`css
.scroll-container {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.scroll-item {
  scroll-snap-align: center;
}
\`\`\`

## 总结

- 简单场景用 overflow-x + flex 即可
- 需要吸附效果用 scroll-snap
- 移动端注意添加 -webkit-overflow-scrolling
    `,
    tags: ['CSS', '布局', '横向滚动'],
  },
  {
    id: 'frontend-ai-mcp',
    title: '前端工程师的AI修养：如何把MCP用好',
    date: '2025-02-28',
    category: 'AI',
    summary: '探讨前端工程师如何利用MCP（Model Context Protocol）提升开发效率，以及在实际项目中的最佳实践。',
    content: `
## 什么是 MCP

MCP（Model Context Protocol）是一种让 AI 模型与外部工具和数据源交互的协议。对于前端工程师来说，掌握 MCP 的使用可以极大提升开发效率。

## 前端工程师为什么要学 MCP

1. **提升开发效率**：通过 MCP 连接代码仓库、文档等资源
2. **自动化工作流**：将重复性工作交给 AI
3. **更好的代码质量**：AI 辅助代码审查和重构

## 实践指南

### 1. 配置 MCP Server

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    }
  }
}
\`\`\`

### 2. 常用 MCP 工具

- 文件系统读写
- Git 操作
- 数据库查询
- API 调用

## 总结

MCP 是前端工程师拥抱 AI 时代的重要工具，值得深入学习和实践。
    `,
    tags: ['AI', 'MCP', '开发效率'],
  },
  {
    id: 'vue3-composition-api',
    title: 'Vue3 Composition API 最佳实践',
    date: '2025-01-20',
    category: 'Vue',
    summary: '总结Vue3 Composition API的使用技巧和最佳实践，包括组合式函数的组织方式。',
    content: `
## 为什么用 Composition API

Composition API 解决了 Options API 在大型组件中代码组织混乱的问题。

## 最佳实践

### 1. 使用 composables 复用逻辑

\`\`\`javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}
\`\`\`

### 2. 响应式数据分组

将相关的状态和方法放在一起，而不是按选项类型分组。

### 3. 使用 toRefs 保持响应性

\`\`\`javascript
import { toRefs } from 'vue'

export function useFeature(props) {
  const { data } = toRefs(props)
  // data 保持响应性
}
\`\`\`

## 总结

Composition API 让代码更灵活、更易复用，是 Vue3 开发的首选方式。
    `,
    tags: ['Vue', 'Composition API', '最佳实践'],
  },
]

/**
 * 按年份分组博客列表
 */
export function getArchivesByYear() {
  const archives = {}
  blogList.forEach((blog) => {
    const year = blog.date.slice(0, 4)
    if (!archives[year]) {
      archives[year] = []
    }
    archives[year].push(blog)
  })
  return archives
}
