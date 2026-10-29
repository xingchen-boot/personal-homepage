/** 虚拟列表 + 流式：按 Pi 精读章法写的教学长文 */
export const virtualListContent = `
![会话流与虚拟列表](/blog/cover-virtual.jpg "封面：长列表与流式到达是同一类工程题")

> 虚拟列表教程通常停在「只渲染可视区」。真要能在消息流、日志、行情里用起来，你还得搞清：**缓冲带、滚动锚定、节点回收与状态、流式追加如何不打架**。本文按「概念 → 模型 → 代码骨架 → 翻车点」写，读完应能自己实现一版可用的窗口，而不是只会用某个 UI 库的 \`VirtualList\` 组件。

---

## 一、为什么全量 DOM 会挂

一万条消息，每条一个气泡节点：布局、样式、事件监听一起涨。瓶颈往往是：

| 成本 | 表现 |
|------|------|
| 节点数 | 创建 / 销毁 / GC |
| 布局 | 整表 reflow |
| 样式 | 深选择器 × N |
| 内存 | 文本 + vnode + 闭包 |

虚拟列表的核心交换是：

\`\`\`
正确性需求：用户以为「全部都在」
实现真相：只有「可视区 ± 缓冲带」真的挂着 DOM
\`\`\`

![虚拟列表只渲染可视区](/blog/virtual-list.svg "图 1：全量 DOM vs 可视区 + 缓冲带")

**配图说明**：右侧用占位总高度撑开滚动条；真实节点只覆盖阴影可视区与上下缓冲。少了缓冲，快滑时会闪白。

---

## 二、先建立窗口模型（比写代码重要）

把列表想成一条很长的卷尺，窗口是滑块：

\`\`\`
scrollTop
    │
    ▼
────┬─────────────────────────────┬────
    │  above spacer (空白占位)     │
────┼─────────────────────────────┼────
    │  bufferTop                   │
    │  ★ visible items             │  ← 真实 DOM
    │  bufferBottom                │
────┼─────────────────────────────┼────
    │  below spacer                │
────┴─────────────────────────────┴────
总高度 ≈ sum(itemHeight) 或 estimated × N
\`\`\`

你必须维护的状态很少，但每一项都不能糊：

1. \`scrollTop\` / viewportHeight  
2. \`startIndex\` / \`endIndex\`（含缓冲）  
3. 每项高度（定高 or 测量缓存）  
4. 上方占位高度、下方占位高度  

> 定高列表是教学理想态；变高列表的本质是「多一个高度缓存 + 在测量后修正 spacer」。先搞定定高，再加测量，顺序反了会同时调试两套 bug。

---

## 三、定高列表：最小正确实现的心智代码

\`\`\`javascript
function getRange(scrollTop, viewportH, itemH, total, buffer) {
  const start = Math.max(0, Math.floor(scrollTop / itemH) - buffer)
  const visible = Math.ceil(viewportH / itemH)
  const end = Math.min(total, start + visible + buffer * 2)
  return { start, end }
}

function spacers(start, end, itemH, total) {
  return {
    top: start * itemH,
    bottom: (total - end) * itemH,
  }
}
\`\`\`

渲染时：只 \`items.slice(start, end)\`，外面包 \`top/bottom\` 两段 spacer。  
滚动事件里重算 range——**记得 rAF 合批**，否则触控板上每帧 slice 会抖。

---

## 四、流式追加：和虚拟列表最常打架的地方

Agent 对话、日志尾随、行情推送都是「底部不断长」。三种策略：

| 策略 | 行为 | 适用 |
|------|------|------|
| 钉住底部 | 用户在底部附近则自动 \`scrollToEnd\` | 聊天默认 |
| 保持阅读位置 | 上方插入/高度变化时补偿 \`scrollTop\` | 用户上翻历史 |
| 暂停自动滚 | 用户离开底部超过阈值 | 防「抢滚动」 |

关键细节：**流式 token 到达时，当前最后一项高度在变**。若你用定高估算，不在 \`ResizeObserver\` / 测量回调里更新缓存，spacer 会越漂越远，出现「跳一下」或空白洞。

\`\`\`
用户正在看旧消息（不在底部）
  → 底部流式追加 → 总高度变大
  → 若不做锚定：视口内容会被「顶走」或「塌陷」
  → 锚定：记录锚点 item + 距顶偏移，更新后恢复
\`\`\`

---

## 五、回收与状态：虚拟化最阴的坑

DOM/组件被回收复用时：

- 输入框草稿、展开/折叠、悬停态会串到错误 item  
- 图片懒加载要按 id 取消，而不是按 DOM 节点  
- 与「CSS 下沉 / 样式透传」叠加时，伪类状态更要跟数据 id 走，不跟节点走  

纪律：**可视状态进 store（按 itemKey），DOM 只是投影。**

---

## 六、和 Web Worker / EventSource 怎么分工

长连接推过来的数据不要直接在主线程做重计算：

\`\`\`
EventSource/WS  →  解析/合并（可 Worker）  →  主线程只应用「窗口差分」
\`\`\`

主线程每次 ideally：更新数组引用 → 若索引窗口变化才重渲染切片。  
千万别每来一个 token 就全表 \`map\` 出一万个 vnode。

---

## 七、怎么知道自己学会了

1. 画出 spacer + buffer，并说明去掉 buffer 会出现什么。  
2. 解释定高与变高差在哪个数据结构。  
3. 用户上翻历史时来了流式消息，你如何避免抢滚动。  
4. 为什么「展开态」不能只存在组件局部 \`data\` 里。

能答清，你才是在做**窗口化系统**，而不是「拷贝了一段虚拟列表 demo」。

---

## 小结

虚拟列表解决节点上限；流式追加解决时间轴增长；二者交汇处要用**锚定、高度缓存、按 key 存状态**。先定高跑通，再测量变高，再接 SSE——分层排障，比一次上齐全家桶快一个数量级。
`

export default virtualListContent
