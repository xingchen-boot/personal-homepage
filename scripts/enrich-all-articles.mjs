/**
 * 给每篇文章追加「加厚块」：案例、FAQ、清单、反例
 * 运行：node scripts/enrich-all-articles.mjs
 * 然后：cd server && node seed-all-articles.js
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const EXTRA = {
  'css-runtime-sinking': `
## 6. 一个可复述的排查剧本

当业务反馈「下沉后样式不对」时，我习惯按这个顺序查：

1. **是不是编译产物丢了**：对比浏览器 DevTools 里最终生效的规则，和 cssMap 是否还能表达同样选择器
2. **是不是权重/顺序漂了**：同一 class 多来源时，记录来源顺序与 \`!important\`
3. **是不是 scoped 边界错了**：跨组件透传 class 时最容易出现「看起来写上了但不生效」
4. **是不是变量没建依赖**：主题切换后局部没刷新，优先查变量索引
5. **是不是虚拟列表节点复用带了脏状态**：复用行时样式状态是否重置

把这五步写成团队 FAQ，比临时加 hack 更值钱。

## 7. 和「纯前端性能优化」的差别

传统前端性能谈的是主线程与字节；样式下沉还多了：

- 跨语言契约（TS/JS ↔ C++）
- 多窗口进程/内存模型
- 与原生布局/绘制管线的交接

所以复盘时要同时讲 **工程约束** 与 **指标**，否则听起来像普通 CSS 技巧。
`,
  'virtual-list-streaming': `
## 6. 可变行高的实用算法

固定行高最好做；可变行高可以用「锚点 + 缓存高度表」：

1. 维护 \`offsetMap[index]\`（或前缀和）
2. 首次按估测高度布局
3. 行挂载后测量真实高度，写回缓存
4. 若误差超过阈值，校正下方偏移（必要时轻微调整 scrollTop）

关键是：**不要每帧全量重算所有 offset**，只更新脏区间。

## 7. 流式 UI 的状态机

建议显式状态：\`idle | connecting | streaming | aborted | error | done\`。
UI 只认状态，不在多个 \`if\` 里散落 \`isTyping\`。
abort 时要同时：关 EventSource、清缓冲、恢复输入框。
`,
  'frontcode-ai-agent': `
## 7. 安全与权限模型（必须先想）

终端 Agent 默认能力过大。最小集：

- 工作区白名单
- 危险命令二次确认（\`rm -rf\`、\`git push --force\`）
- 密钥不进日志
- 工具结果截断，防止 prompt 注入刷屏

没有权限模型的 Agent，只适合本地玩具，不适合给别人用。

## 8. 评测怎么做

准备 20 个真实任务（修 bug、加接口、写测试），记录：

- 成功率
- 平均工具调用次数
- 人工介入次数
- 总耗时

比「demo 好看」更能指导迭代。
`,
  'js-performance': `
## 五、实战案例：首页变慢怎么拆

1. Lighthouse 看 LCP 元素是不是大图/字体
2. Performance 面板找 Long Task > 50ms
3. Coverage 看有多少 CSS/JS 未使用
4. Network 看是否队头阻塞、是否该 HTTP/2/3
5. 若是列表页，先虚拟化再谈微优化

## 六、团队协作建议

- 性能预算写进 README（首屏 JS < X KB gzip）
- CI 可加 bundle size 对比
- 大 PR 必须带前后指标截图
`,
  'docker-basics': `
## 多阶段构建再完整一点

\`\`\`dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
USER node
CMD ["node", "dist/index.js"]
\`\`\`

前端静态资源可再拆到 Nginx 镜像，API 与静态分离。

## 健康检查

\`\`\`dockerfile
HEALTHCHECK CMD wget -qO- http://127.0.0.1:3001/health || exit 1
\`\`\`

编排层才能正确重启异常实例。
`,
  'js-async-await': `
## 顶层 await 与模块

ESM 支持顶层 \`await\`，适合应用入口初始化；库代码慎用，以免拖慢导入图。

## 与 UI 框架结合

Vue/React 里：

- 请求放 effect / watchEffect，并清理
- 用递增 \`requestId\` 丢弃过期响应
- 错误边界 / 页面级 toast 统一处理

\`\`\`javascript
let seq = 0
async function load(id) {
  const my = ++seq
  const data = await api(id)
  if (my !== seq) return // 过期
  view.data = data
}
\`\`\`
`,
  'css-grid-layout': `
## 与子网格

\`\`\`css
.card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100%;
}
\`\`\`

卡片内部再用 Grid/Flex，外层 gallery 负责列轨道——职责分离更清晰。

## 调试技巧

Firefox / Chrome Grid 检查器可以看线名与间隙。
遇到溢出：先给轨道 \`minmax(0,1fr)\`，再查子项 \`white-space\` / 图片固有尺寸。
`,
  'vue-router-guide': `
## keep-alive 与路由

\`\`\`vue
<router-view v-slot="{ Component }">
  <keep-alive :include="cached">
    <component :is="Component" />
  </keep-alive>
</router-view>
\`\`\`

只缓存列表页，详情页不缓存，避免内存涨与脏数据。
\`meta.keepAlive\` 可驱动 \`cached\` 列表。

## 路由级代码分割策略

按业务域拆：\`views/blog/*\`、\`views/resume/*\`。
避免一个 \`import()\` 拉进整个图表库——二次动态 import 放在组件内部。
`,
  'typescript-generics': `
## 实战：Result 类型

\`\`\`typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

async function tryJson<T>(url: string): Promise<Result<T>> {
  try {
    const value = await getJson<T>(url)
    return { ok: true, value }
  } catch (error) {
    return { ok: false, error: error as Error }
  }
}
\`\`\`

用泛型把成功/失败变成可穷举结构，UI 分支更安全。

## 什么时候别用泛型

三行逻辑、调用点唯一——直接写具体类型更清晰。
泛型是为了复用与约束，不是为了「看起来高级」。
`,
  'node-express-rest': `
## 分层示例

\`\`\`javascript
// services/blogService.js
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM blogs WHERE id=? LIMIT 1', [id])
  return rows[0] || null
}
module.exports = { findById }
\`\`\`

路由只负责 HTTP，service 负责业务，db 负责连接。

## 分页与过滤

\`\`\`javascript
const page = Math.max(1, Number(req.query.page) || 1)
const size = Math.min(50, Number(req.query.size) || 10)
const offset = (page - 1) * size
\`\`\`

永远限制 \`size\` 上限，防止一次拖垮数据库。
`,
  'git-workflow': `
## commit message

推荐约定式：\`feat:\` \`fix:\` \`docs:\` \`refactor:\` \`chore:\`。
正文写清动机；关联 issue。

## 主干保护

- main 禁止直推
- 必须 PR + CI
- 可选 require review

个人项目也建议开 PR，给未来自己留审计轨迹。

## 常见灾难恢复

- 改错未推送：\`git reset\` / \`restore\`
- 已推送但仅自己用：\`git push --force-with-lease\`（慎用）
- 误删文件：\`git checkout HEAD -- path\`
`,
  'mysql-index': `
## 案例：评论列表慢

原 SQL：\`WHERE blog_id=? ORDER BY created_at DESC LIMIT 20\`
无联合索引时可能 filesort。

\`\`\`sql
CREATE INDEX idx_comments_blog_created ON comments(blog_id, created_at);
\`\`\`

再用 EXPLAIN 确认 \`key\` 命中，\`Extra\` 不再 filesort。

## 覆盖与回表权衡

覆盖索引加快读，但更占空间、拖慢写。
热点读路径值得覆盖；冷门后台报表不一定。
`,
  'frontend-ai-mcp': `
## 前端落地检查表

1. Server 是否最小权限
2. 工具描述是否让模型「选对」
3. 超时与重试
4. 用户可见的工具调用日志
5. 与本地 Skill / RAG 如何分工

## 和本站的关系

本站本地助手暂时不做 MCP（无 API Key 检索）。
但 FrontCode / Pi / dsh 精读都在补「工具协议」这块肌肉——前端同学值得提前练。
`,
  'react-hooks-guide': `
## 与数据请求库

自己写 \`useEffect\` 请求可以，但项目一大更建议 React Query / SWR：缓存、重试、去重都更省心。
Hooks 负责粘合，专业库负责数据生命周期。

## 常见面试追问

- 为什么不能条件调用 Hook？——需要稳定链表顺序
- useEffect 依赖遗漏会怎样？——闭包旧值 / 不同步
- useMemo 一定更快吗？——不一定，有记忆成本
`,
  'vue3-composition-api': `
## 与 Pinia

组件内状态用 ref；跨页共享用 Pinia。
composable 不要偷偷变全局单例，除非明确是 \`useEventBus\` 这类。

## script setup 小技巧

- \`defineModel\` 简化 v-model
- \`defineOptions\` 补 name 以配合 keep-alive
- 重逻辑拆到 \`composables/\`，页面文件保持可扫读
`,
  'css-horizontal-scroll': `
## 完整可访问模板思路

1. 轨道 \`role="region"\` + \`aria-label\`
2. 前/后按钮 \`aria-controls\`
3. 按钮滚动：\`container.scrollBy({ left: ±cardWidth, behavior: 'smooth' })\`
4. 根据 \`scrollLeft\` 更新按钮 disabled

这样即使隐藏滚动条，键盘与读屏用户仍能用。

## 和轮播的边界

只要「用户掌控滚动」，用轨道；要「自动播放/指示点」，再上轮播组件，不要混成四不像。
`,
}

async function enrichFile(relPath, exportName) {
  const full = path.join(root, relPath)
  const mod = await import(pathToFileURL(full).href + `?t=${Date.now()}`)
  const list = mod[exportName]
  if (!Array.isArray(list)) throw new Error(`no ${exportName} in ${relPath}`)

  const next = list.map((article) => {
    const add = EXTRA[article.id]
    if (!add) return article
    if (article.content.includes('## 6.') || article.content.includes('## 五、实战案例') || article.content.includes('## 完整可访问模板')) {
      return article
    }
    return { ...article, content: `${article.content.trim()}\n${add.trim()}\n` }
  })

  const body = next.map((a) => `  {
    id: ${JSON.stringify(a.id)},
    title: ${JSON.stringify(a.title)},
    date: ${JSON.stringify(a.date)},
    category: ${JSON.stringify(a.category)},
    summary: ${JSON.stringify(a.summary)},
    content: \`\n${a.content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\n    \`,
    tags: ${JSON.stringify(a.tags || [])},
  }`).join(',\n')

  let header = fs.readFileSync(full, 'utf8').split('export const')[0]
  if (relPath.includes('classicArticles')) {
    header = `/**\n * 站内「经典技术文」深度正文（加厚版）\n */\n\nconst cover = '/blog/cover-generic.svg'\n\n`
  }
  if (relPath.includes('resumeArticles')) {
    header = `/**\n * 简历向深度技术文章（加厚版）\n */\n\n`
  }
  fs.writeFileSync(full, `${header}export const ${exportName} = [\n${body}\n]\n`, 'utf8')
  console.log('enriched', relPath, next.length)
}

await enrichFile('src/data/resumeArticles.js', 'resumeArticles')
await enrichFile('src/data/articles/classicArticles.js', 'classicArticles')
console.log('done')
