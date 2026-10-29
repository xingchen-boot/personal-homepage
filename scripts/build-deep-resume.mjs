/**
 * 生成更深的 resumeArticles 内容并写回 src/data/resumeArticles.js
 * 运行：node scripts/build-deep-resume.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const articles = [
  {
    id: 'css-runtime-sinking',
    title: '从 Electron 到 Qt：CSS 下沉链路怎么打通',
    date: '2026-06-12',
    category: '性能优化',
    summary:
      '腾讯实习深度复盘：Vue SFC→cssMap→Qt StyleEngine 的编译期结构化、窗级共享、脏集增量、Profiling 方法与迁移纪律。',
    tags: ['CSS Runtime', 'Qt', '性能优化', '腾讯实习'],
    content: `# 见下方模板`,
  },
]

// 直接写完整文件更可控
const out = `/**
 * 简历向深度技术文章（加长版）
 * - 本地兜底：合并进 blogs.js
 * - DB：node server/seed-all-articles.js
 */
export const resumeArticles = ${JSON.stringify(await buildArticles(), null, 2)}
`

async function buildArticles() {
  return [
    {
      id: 'css-runtime-sinking',
      title: '从 Electron 到 Qt：CSS 下沉链路怎么打通',
      date: '2026-06-12',
      category: '性能优化',
      summary:
        '腾讯实习深度复盘：Vue SFC→cssMap→Qt StyleEngine 的编译期结构化、窗级共享、脏集增量、Profiling 方法与迁移纪律。',
      tags: ['CSS Runtime', 'Qt', '性能优化', '腾讯实习'],
      content: cssArticle(),
    },
    {
      id: 'virtual-list-streaming',
      title: '万级列表与流式 AI：两段前端性能实战',
      date: '2026-01-20',
      category: '性能优化',
      summary:
        '电信 + 三七实习合并复盘：虚拟列表、双向滚动补偿、EventSource 流式与 Worker 轮询的完整问题拆解。',
      tags: ['虚拟列表', 'EventSource', 'Web Worker', '性能优化'],
      content: virtArticle(),
    },
    {
      id: 'frontcode-ai-agent',
      title: 'FrontCode：做一个类 Claude Code 的终端 Agent',
      date: '2026-04-08',
      category: 'AI',
      summary:
        '个人 Agent 项目长文：Tool Loop、MCP、Skill、RAG、权限与可观测性；并链到 Pi / dsh 精读笔记。',
      tags: ['AI Agent', 'MCP', 'RAG', 'Node.js'],
      content: agentArticle(),
    },
  ]
}

function cssArticle() {
  return `
![PC QQ 样式工程氛围图](/blog/cover-css.jpg "封面：从 Web 样式思维走向原生渲染")

## 写在前面

这篇文章不是「CSS 语法教程」，而是一次 **跨渲染栈的样式系统迁移** 笔记。
在腾讯 PC QQ 相关实习中，业务仍大量用 Vue 描述 UI，但目标渲染逐步走向 Qt / Fabric。若每个窗口继续按浏览器思路各自解析样式，多窗口冷挂载会被重复工作拖死。

我参与的方向是 **CSS 下沉**：把静态样式变成可共享、可索引、可增量更新的数据，而不是把 \`.css\` 文件原样塞进 C++。

![CSS 下沉目标链路](/blog/css-pipeline.svg "图 1：Vue SFC → cssMap → StyleEngine → Fabric")

## 1. 问题定义：到底贵在哪里

冷挂载贵，通常不是「画像素」本身，而是：

1. **重复解析**：同样的选择器在多个窗口被反复解析
2. **重复建图**：静态规则没有窗级复用
3. **更新过粗**：主题 Token 一变就全树重算
4. **不可解释**：权重 / scoped / 伪类与浏览器不一致，业务只能打补丁

所以目标函数很清楚：

- 语义尽量对齐 Web（迁移成本）
- 静态工作尽量一次完成（性能）
- 动态更新尽量落在脏集（可扩展）

## 2. 目标链路拆解

\`Vue SFC → 编译产物 / cssMap → 节点元数据 → Qt StyleEngine → Fabric\`

### 2.1 编译期：样式要变成数据

编译期需要产出至少这些信息：

- 选择器文本与结构化索引（类、标签、属性）
- 特异性 / 来源顺序 / \`!important\`
- scoped 边界
- 变量声明与依赖
- 可能的伪类集合

> 编译期丢掉的信息，运行时只能靠猜或全量重算补回来——两者都很贵。

### 2.2 窗级共享：静态图只建一次

同一业务多开窗口时，静态 cssMap 应共享；窗口只保留自己的节点实例与动态状态。
这是冷挂载优化的主杠杆之一。

### 2.3 运行时：StyleEngine 的能力清单

实践中必须覆盖：

- 选择器匹配与权重
- scoped 隔离
- 伪类状态
- CSS 变量
- 跨组件 class 传递与覆盖
- 虚拟列表场景下的样式透传

漏一个边界 case，业务侧就会出现「在浏览器好好的，下沉后错了」。

## 3. Profiling：把故事变成数字

我们把冷挂载拆成阶段：解析 → 建图 → 首次级联 → 提交渲染，分别打点。

优化组合拳：

1. **批内建图**
2. **脏集更新**
3. **样式命中缓存**
4. **主题增量**（变量依赖索引）

在 650 节点调试页：冷挂载约 **44.859s → 378ms**，选择器解析次数约 **-99%**。
数字会随场景变化，但方法论可迁移：**先分段，再对最贵段下药**。

### 主题增量为什么难

Token 看似全局，实际影响子图。没有依赖边，就只能全窗刷新。
建立 \`变量 → 使用点\` 索引后，更新才能局部化。

## 4. 迁移纪律（比代码更重要）

1. **契约先冻**：cssMap 字段变更要有版本意识
2. **等价优先**：先对齐视觉与交互，再追极致性能
3. **可测**：权重、scoped、伪类写成单测，不只靠截图
4. **灰度**：按窗口 / 业务模块放量，保留回退

## 5. 面试/复盘时怎么讲清楚

一句话：

> 我做的不是写 CSS，而是把样式系统从「页面技巧」升级为「可共享的运行时引擎」，并用 Profiling 证明冷挂载数量级优化。

## 小结

CSS 下沉的本质是 **编译期结构化 + 运行时级联 + 增量刷新**。
对前端同学，这是一次难得的「系统级」训练：你开始关心契约、脏集、可观测与迁移成本——而不只是选择器怎么写好看。
`.trim()
}

function virtArticle() {
  return `
![性能与流畅感](/blog/cover-perf.jpeg "封面：把「卡」变成可测量、可拆解的问题")

## 这篇文章解决什么

两段真实实习场景：

1. **电信 · 检察政务**：万级列表、流式 AI 问答、大文件上传
2. **三七互娱 · 海外客服**：双向虚拟滚动、Worker 轮询、富文本扩展

它们表面不同，底层都是：主线程别干重活，DOM 别养太多，等待要可感知。

![虚拟列表只渲染可视区](/blog/virtual-list.svg "图 1：全量 DOM vs 可视区 + 缓冲带")

## 1. 虚拟列表：从 800MB 到 280MB

### 1.1 为什么组件库不够用

政务表格经常：

- 列多、单元格定制强
- 行高不完全固定
- 权限 / 字典 / 操作列耦合深

于是我们自研虚拟列表：可见 DOM 收敛到约 **30** 个节点，内存约 **800MB → 280MB**，滚动 **55fps+**。

### 1.2 实现要点

1. 计算 \`start/end\`（加缓冲带）
2. 占位高度撑起 \`scrollHeight\`
3. 行节点回收复用
4. 可变行高：估测 + 测量校正，防止累计误差

### 1.3 双向滚动与 scrollTop 补偿

聊天向上加载历史时，头部插入会把视口「顶飞」。

\`\`\`javascript
const prev = scroller.scrollHeight
prepend(older)
const delta = scroller.scrollHeight - prev
scroller.scrollTop += delta
\`\`\`

再区分「用户在底部跟随新消息」与「正在翻历史」，避免自动吸底打架。

## 2. 流式 AI：把 3s 等待变成 0.8s 首包

EventSource / SSE 的价值不是打字机动画，而是 **渐进可见**。

注意：

- chunk 合并，避免每 token 触发布局
- 可取消（用户点停止）
- 半成品 Markdown 的渲染策略
- 重连与错误态

## 3. Worker 轮询：主线程只做指挥

多平台客服并行拉取时，主线程 \`setInterval\` 会偷输入事件。
轮询进 Worker，主线程只注册任务与消费结果。

## 4. 对照表

| 场景 | 矛盾 | 手段 | 结果 |
| --- | --- | --- | --- |
| 万级表 | DOM/内存 | 虚拟列表 | 800→280MB |
| 聊天史 | 插入跳动 | scrollTop 补偿 | 锚定稳定 |
| AI 问答 | 长等待 | 流式 | 首包 3s→0.8s |
| 多平台 | 主线程堵 | Worker | 输入不卡 |

## 5. 可复用方法论

1. 先画数据流与线程边界
2. 定指标（内存、FPS、首包）
3. 一次只打穿一个瓶颈
4. 把补偿/取消/降级写成库，而不是页面 if-else

## 小结

性能优化是分层治理：渲染、网络、体验。
把「卡」说清楚，比堆术语更能帮到下一个维护者。
`.trim()
}

function agentArticle() {
  return `
![终端 Agent 的工作台](/blog/cover-agent.jpg "封面：让模型不只会说，还能动手")

## 目标

FrontCode 想做：在终端把 **推理** 和 **动手** 接起来。
技术栈：Node.js + OpenAI SDK，并引入 MCP、Skill、LanceDB RAG。

![Tool Agent 循环](/blog/agent-loop.svg "图 1：输入 → 决策 → 工具 → 回传")

## 1. Tool Agent 循环（真正难的在工程）

伪代码：

\`\`\`javascript
async function runAgentStep(messages) {
  const response = await client.chat.completions.create({ model, messages, tools })
  const toolCalls = response.choices[0].message.tool_calls
  if (!toolCalls?.length) return response.choices[0].message.content
  for (const call of toolCalls) {
    const result = await executeTool(call)
    messages.push({ role: 'tool', tool_call_id: call.id, content: result })
  }
  return runAgentStep(messages)
}
\`\`\`

你必须设计：

- 步数上限 / 超时
- 失败重试与幂等
- 权限（可写目录、可执行命令）
- 防死循环（同一工具反复失败）
- 每步可观测（日志、trace、人工打断）

## 2. MCP：能力热插拔

不要把所有工具焊死在仓库。MCP 让文件系统、浏览器、数据库以 Server 形式挂载。
边界清晰：谁授权、谁审计、失败如何降级。

## 3. Skill：用时加载领域知识

Markdown Skill + 目录扫描 + 按需注入。
好处：省 token、好维护、可按项目裁剪。

## 4. RAG / 记忆

LanceDB 做本地向量检索；跨会话记忆要可清理，避免污染。
检索结果带来源路径，方便人审。

## 5. 多模态路由

图片走视觉模型，文本走工具循环——路由表要显式，别挤成一条脆弱管道。

## 6. 相关阅读（Pi / dsh）

我另外整理了两套精读笔记（本机 Astro，默认 4321）：

- [Pi Agent 阅读指南（我的副本）](http://127.0.0.1:4321/mine/)
- [dsh 源码精读 · 开篇](http://127.0.0.1:4321/modules/dsh-ch01)
- 上游：[earendil-works/pi](https://github.com/earendil-works/pi) · [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- 官方文档：[DeepSeek Harness Docs](https://deepseek-harness.github.io/deepseek-harness/)

对照 Pi（循环中心）与 dsh（一切皆插件）能更好理解 FrontCode 的取舍。

## 小结

能用的终端 Agent，工程比重往往大于 Prompt：可观测的调度、可插拔工具、可检索知识、可恢复失败。
FrontCode 仍在迭代，但这副骨架已经能支撑日常开发助手。
`.trim()
}

const file = `/**
 * 简历向深度技术文章（加长版）
 * - 本地兜底：合并进 blogs.js
 * - 同步 DB：node server/seed-all-articles.js
 */
export const resumeArticles = ${JSON.stringify(await buildArticles(), null, 2).replaceAll(/\\n/g, '\\n')}
`

// JSON.stringify already escapes; but we want readable template with real newlines in source
const readable = `/**
 * 简历向深度技术文章（加长版）
 */
export const resumeArticles = [
${(await buildArticles()).map((a) => `  {
    id: ${JSON.stringify(a.id)},
    title: ${JSON.stringify(a.title)},
    date: ${JSON.stringify(a.date)},
    category: ${JSON.stringify(a.category)},
    summary: ${JSON.stringify(a.summary)},
    content: \`\n${a.content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\n    \`,
    tags: ${JSON.stringify(a.tags)},
  }`).join(',\n')}
]
`

fs.writeFileSync(path.join(root, 'src/data/resumeArticles.js'), readable, 'utf8')
console.log('wrote resumeArticles.js')
