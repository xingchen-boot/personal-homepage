/** FrontCode：按 Pi 精读章法写的教学长文 */
export const frontcodeAgentContent = `
![终端 Agent 的工作台](/blog/cover-agent.jpg "封面：让模型不只会说，还能动手")

> 这篇文章不是「如何调一次 Chat API」的教程，而是回答：**把大模型变成能动手的终端 Agent，工程上到底要建什么？** 读完你会能亲手画出一条消息的旅程，说清循环何时停、工具如何插拔、权限边界放在哪——而不是只会背「Tool Calling」四个字。

---

## 一、开场：三种用法，为什么要 Agent Loop

在写 FrontCode 之前，先把「用大模型」拆成三种模式。搞不清这个分野，后面所有代码都会糊成一团。

### 模式 1：直接调用 ——「模型，回答我」

\`\`\`
用户输入 → 拼提示词 → 调一次模型 → 展示结果
\`\`\`

适用：翻译、摘要、问答、单次补全。**决策权在人，模型只执行一次。**

### 模式 2：Workflow ——「我定步骤，模型填格子」

\`\`\`
输入 → [模型分析] → [你的代码分支] → [模型生成] → [你的代码校验] → 输出
\`\`\`

步骤之间由**你的代码**控制。适合文档流水线、固定 RAG。模型是流水线环节，不是决策者。

### 模式 3：Agent Loop ——「模型自己决定下一步」

\`\`\`
输入 → 调模型 → 要读文件 → 执行 → 再调模型 → 要改文件 → 执行 → 模型说做完了 → 停
\`\`\`

**步骤流转由模型输出驱动。** 你的运行时只做两件事：喂消息；若有 tool call 就执行，否则结束。

| 维度 | 直接调用 | Workflow | Agent Loop |
|------|---------|----------|------------|
| 决策者 | 用户 | 你的代码 | 模型 |
| 调用次数 | 1 | N（代码定） | 不确定（模型定） |
| 你该写什么 | 提示词 | 流程与校验 | 工具 + 循环 + 权限 |
| 典型场景 | 摘要 | RAG 流水线 | 终端编码助手 |

FrontCode 选的是模式 3。一旦选了，工程重心就从「写 prompt」变成「定义工具、循环规则与安全边界」。

![Tool Agent 循环](/blog/agent-loop.svg "图 1：输入 → 决策 → 工具 → 回传 → 再决策")

**配图说明**：外圈是一次完整任务（Trace），内圈每次「调模型 + 执行本轮工具」是一个 Turn。没有工具调用时循环退出。

---

## 二、先把概念钉死：Trace 与 Turn

这两个词容易混用。在 FrontCode（以及对照精读的 Pi）里，定义要精确。

### Trace：一次完整任务

从用户回车，到 Agent 彻底停下来，叫做一个 Trace。一个 Trace 里可以有多个 Turn。

### Turn：一次模型调用 + 本轮触发的全部工具

关键句：**一个 Turn 只有一次模型调用。** 同一次返回里若要求了 3 个工具，它们同属本 Turn；把结果喂回去再调模型，那是下一个 Turn。

\`\`\`
Trace（用户："修一下登录 bug"）
│
├── Turn 1：调模型 → tool_calls[read, grep] → 执行两个工具
├── Turn 2：带结果再调 → tool_calls[edit] → 执行 edit
└── Turn 3：再调 → 无 tool_calls → 输出结论 → Trace 结束
\`\`\`

> 若你把「执行工具」和「再调模型」塞进同一个模糊的 while，调试时你会分不清：是模型又想调工具，还是你在重试失败的工具。Turn 边界就是可观测性的骨架。

---

## 三、一条消息的旅程（FrontCode 运行时）

假设用户输入：\`帮我看看 src/auth.ts 里 token 过期怎么处理的\`。

\`\`\`
① 用户输入变成 messages 末尾一条 user
② 进入 runAgentLoop（Trace 开始）
③ stream / create：带上 tools 定义调模型
④ 若 choices[0].message.tool_calls 非空：
     对每个 call → executeTool → push { role: 'tool', tool_call_id, content }
⑤ 回到 ③（新 Turn）
⑥ 若无 tool_calls：把 assistant 文本交给 UI，Trace 结束
\`\`\`

最小可跑骨架（教学用，生产还要加上限与权限）：

\`\`\`javascript
async function runAgentStep(messages, { maxTurns = 12 } = {}) {
  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await client.chat.completions.create({
      model,
      messages,
      tools,
    })
    const msg = response.choices[0].message
    messages.push(msg)

    const calls = msg.tool_calls
    if (!calls?.length) return msg.content

    for (const call of calls) {
      const result = await executeTool(call) // 内含权限检查
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: truncate(result, 32_000),
      })
    }
  }
  throw new Error('maxTurns exceeded')
}
\`\`\`

读这段时盯住三件事：

1. **assistant 带 tool_calls 的消息必须进 history**，否则下一轮模型不知道自己请求过什么
2. **每条 tool 结果必须带同一个 tool_call_id**
3. **maxTurns 是人类规则**，不是模型自己停——模型可能永远觉得「再试一次」

---

## 四、工具层：焊死 vs 热插拔

### 4.1 内置工具：先够用，再求全

FrontCode 起步四件套就够学循环：\`read\` / \`write\` / \`edit\` / \`bash\`。  
工具定义是给模型看的 JSON Schema，描述越清晰，乱调越少。

| 工具 | 模型以为它能做什么 | 你真正要守住的边界 |
|------|-------------------|-------------------|
| read | 读任意路径 | 工作区白名单、大小上限 |
| write/edit | 改文件 | 禁止改 .env / 密钥目录 |
| bash | 跑命令 | 黑名单、超时、无交互 |

### 4.2 MCP：能力不要焊死在仓库

MCP（Model Context Protocol）把「工具实现」挪到独立 Server：文件系统、浏览器、数据库各自进程。Agent 只拿 tool 列表与调用通道。

好处不是「酷」，而是：

- 权限与审计可以落在 Server 侧
- 仓库不膨胀成万能工具箱
- 某个 Server 挂了可以降级，不必拖死整个 Loop

### 4.3 Skill：知识按需进上下文

Skill = Markdown 指令包（+ 可选脚本）。**平时不占 token，被点名或路由命中才注入。**  
扩展（加能力）和 Skill（加做法）别混：一个教 Agent「有什么手」，一个教「这类题怎么解」。

---

## 五、记忆与 RAG：检索不是魔法

LanceDB 等本地向量库解决的是「跨文件、跨会话的模糊回忆」。工程上必须显式：

1. **入库单位**：函数 / 文件 chunk，带路径与行号
2. **召回后必带来源**，方便人审，也方便下一 Turn 的 \`read\`
3. **可清理**：错误记忆比没有记忆更伤

> 常见坑：把整份检索结果无截断塞进 messages，几轮后上下文爆炸，模型开始胡说。截断策略和 Turn 上限一样，属于运行时纪律。

---

## 六、安全：没有权限模型就只是本地玩具

终端 Agent 默认能力过大。最小集：

- 工作区白名单（禁止 \`../\` 逃逸）
- 危险命令二次确认：\`rm -rf\`、\`git push --force\`、\`curl | sh\`
- 密钥不进日志；tool 结果截断防 prompt 注入刷屏
- 人类可随时 abort（取消当前 Trace）

Pi 精读里讨论过「YOLO vs 审批疲劳」：默认全放行省事，但对外交付必须有边界。FrontCode 选「默认可写工作区 + 危险动作确认」折中。

---

## 七、怎么知道自己学会了

合上文章前，试着不看代码回答：

1. 直接调用、Workflow、Agent Loop 的**决策者**分别是谁？
2. 一次返回里 3 个 tool_calls，算几个 Turn？再调模型算第几个？
3. 为什么 maxTurns 必须是人类规则？
4. MCP 和 Skill 各解决什么矛盾？
5. 若没有 tool_call_id 对齐，下一轮会发生什么？

能答清，你就不是「用过 Agent」，而是**能设计 Agent 运行时**。

---

## 八、对照阅读（本机精读笔记）

FrontCode 是练习场；要把循环与 harness 吃透，对照两套笔记：

- [Pi Agent 阅读指南](/links) —— 循环中心、极简核心 + 扩展杠杆（友链页；笔记站仅本机）
- [dsh 源码精读 · 开篇](/links) —— 一切皆插件（友链页；笔记站仅本机）
- 上游：[earendil-works/pi](https://github.com/earendil-works/pi) · [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- 文档：[DeepSeek Harness Docs](https://deepseek-harness.github.io/deepseek-harness/)

> 建议路径：先用本文跑通一个本地 Loop → 再读 Pi 第 3 章 Agent Loop → 再看 dsh 如何把工具变成插件。三次同一概念，才会真正长在脑子里。

---

## 小结

能用的终端 Agent，工程比重通常大于 Prompt：**可观测的 Turn、可插拔工具、可截断的记忆、可中止的权限**。FrontCode 仍在迭代，但这副骨架已经足够支撑日常开发助手，也足够当你读 Pi / dsh 时的对照样本。
`

export default frontcodeAgentContent
