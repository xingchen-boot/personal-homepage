import { resumeArticles } from './resumeArticles.js'
import { classicArticles } from './articles/classicArticles.js'
import { cssScrollContent } from './articles/teach/cssScroll.js'
import { mcpFrontendContent } from './articles/teach/mcpFrontend.js'
import { vueCompositionContent } from './articles/teach/vueComposition.js'

/**
 * 全站文章列表（单一事实来源）
 * Pi 精读章法正文；同步 DB：node server/seed-all-articles.js
 */
export const blogList = [
  ...resumeArticles,
  ...classicArticles,
  {
    id: 'css-horizontal-scroll',
    title: 'CSS实现横向滚动布局',
    date: '2025-03-15',
    category: 'CSS',
    summary:
      '宽度策略、scroll-snap、触控手感与无障碍替代——横向轨道从能滚到可交付。',
    tags: ['CSS', '布局', '横向滚动'],
    content: cssScrollContent,
  },
  {
    id: 'frontend-ai-mcp',
    title: '前端工程师的AI修养：如何把MCP用好',
    date: '2025-02-28',
    category: 'AI',
    summary:
      'MCP 在 Agent Loop 中的位置、与 Skill/插件的差别、权限三问与落地检查表。',
    tags: ['AI', 'MCP', '开发效率'],
    content: mcpFrontendContent,
  },
  {
    id: 'vue3-composition-api',
    title: 'Vue3 Composition API 最佳实践',
    date: '2025-01-20',
    category: 'Vue',
    summary:
      '按关注点聚合、composable 约定、响应式边界与 Pinia 分工——结构设计而非语法糖。',
    tags: ['Vue', 'Composition API', '最佳实践'],
    content: vueCompositionContent,
  },
]

/**
 * 按年份分组博客列表
 */
export function getArchivesByYear() {
  const map = {}
  blogList.forEach((blog) => {
    const year = String(blog.date).slice(0, 4)
    if (!map[year]) map[year] = []
    map[year].push(blog)
  })
  return Object.keys(map)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, blogs: map[year] }))
}
