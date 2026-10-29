/**
 * 站内经典技术文（Pi 精读章法）
 * 正文在 ./teach/
 */
import { jsPerformanceContent } from './teach/jsPerformance.js'
import { dockerBasicsContent } from './teach/dockerBasics.js'
import { asyncAwaitContent } from './teach/asyncAwait.js'
import { cssGridContent } from './teach/cssGrid.js'
import { vueRouterContent } from './teach/vueRouter.js'
import { tsGenericsContent } from './teach/tsGenerics.js'
import { nodeExpressContent } from './teach/nodeExpress.js'
import { gitWorkflowContent } from './teach/gitWorkflow.js'
import { mysqlIndexContent } from './teach/mysqlIndex.js'
import { reactHooksContent } from './teach/reactHooks.js'

export const classicArticles = [
  {
    id: 'js-performance',
    title: 'JavaScript 性能优化实战',
    date: '2025-04-20',
    category: '性能优化',
    summary:
      '指标→定位→杠杆：加载、长任务、布局抖动与测量方法；读完能对卡顿页说出贵在哪一段。',
    content: jsPerformanceContent,
    tags: ['性能优化', 'Web Vitals', 'JavaScript'],
  },
  {
    id: 'docker-basics',
    title: 'Docker 入门与实践',
    date: '2025-04-15',
    category: 'DevOps',
    summary:
      '镜像/容器/卷心智模型，可复现 Dockerfile 与 compose；弄清「代码改了容器没变」一类坑。',
    content: dockerBasicsContent,
    tags: ['Docker', '容器', 'DevOps'],
  },
  {
    id: 'js-async-await',
    title: 'JavaScript async/await 完全指南',
    date: '2025-04-10',
    category: 'JavaScript',
    summary:
      '依赖图、并发度、失败语义、取消与竞态——把异步当成控制流设计题来学。',
    content: asyncAwaitContent,
    tags: ['JavaScript', 'Promise', 'async/await'],
  },
  {
    id: 'css-grid-layout',
    title: 'CSS Grid 布局完全指南',
    date: '2025-04-05',
    category: 'CSS',
    summary:
      '一维 Flex vs 二维 Grid、轨道与 areas、auto-fit 响应式；徒手画出版心骨架。',
    content: cssGridContent,
    tags: ['CSS', 'Grid', '布局'],
  },
  {
    id: 'vue-router-guide',
    title: 'Vue Router 路由指南',
    date: '2025-03-28',
    category: 'Vue',
    summary:
      'URL 契约、meta 门禁、懒加载与嵌套布局；同组件切参也不漏更新。',
    content: vueRouterContent,
    tags: ['Vue', 'Vue Router', 'SPA'],
  },
  {
    id: 'typescript-generics',
    title: 'TypeScript 泛型实战',
    date: '2025-03-22',
    category: 'TypeScript',
    summary:
      '从 any 损失讲起：约束、推导、keyof 与 ApiList<T>，把类型参数设计清楚。',
    content: tsGenericsContent,
    tags: ['TypeScript', '泛型'],
  },
  {
    id: 'node-express-rest',
    title: 'Node.js Express 构建 REST API',
    date: '2025-03-18',
    category: 'Node.js',
    summary:
      '中间件管道、分层、async 错误与状态码语义；可上线的 CRUD 骨架。',
    content: nodeExpressContent,
    tags: ['Node.js', 'Express', 'REST'],
  },
  {
    id: 'git-workflow',
    title: 'Git 工作流最佳实践',
    date: '2025-03-12',
    category: '工程化',
    summary:
      '提交粒度、分支角色、rebase/merge 取舍与小 PR——协作契约大于命令表。',
    content: gitWorkflowContent,
    tags: ['Git', '协作', '工程化'],
  },
  {
    id: 'mysql-index',
    title: 'MySQL 索引优化详解',
    date: '2025-03-08',
    category: '数据库',
    summary:
      '最左前缀、失效场景、EXPLAIN 与联合索引设计；索引是空间换时间。',
    content: mysqlIndexContent,
    tags: ['MySQL', '索引', '数据库'],
  },
  {
    id: 'react-hooks-guide',
    title: 'React Hooks 完全指南',
    date: '2025-03-01',
    category: 'React',
    summary:
      '渲染 vs Effect、诚实依赖、自定义 Hook 与清理；告别生命周期硬翻译。',
    content: reactHooksContent,
    tags: ['React', 'Hooks'],
  },
]
