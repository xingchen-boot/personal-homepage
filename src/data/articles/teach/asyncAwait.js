/** async/await：按 Pi 精读章法写的教学文 */
export const asyncAwaitContent = `
![异步编程](/blog/cover-generic.svg "异步不是语法糖，是控制流与失败模型")

> 会写 \`await fetch\` 不等于会做异步。这篇文章把异步当成**控制流设计题**：依赖怎么排、并发怎么限、错误落到哪、取消与竞态如何消掉。读完应能指出一段业务代码里的串行浪费和静默失败，而不是只会把 \`.then\` 改成 \`await\`。

---

## 一、先建立三种时间线

\`\`\`
回调地狱     人脑跟丢「下一步在哪个缩进」
Promise 链   时间线变平，但错误分叉仍易糊
async/await  看起来像同步，失败与取消仍要显式设计
\`\`\`

| 层次 | 你在设计什么 | 常见事故 |
|------|-------------|----------|
| 语法 | 怎么写等待 | 以为学完了 |
| 依赖图 | 谁必须等谁 | 无脑串行拖慢首屏 |
| 失败语义 | 谁 catch、是否降级 | 错误被吞 |
| 生命周期 | 取消与竞态 | 卸载后 setState |

---

## 二、Promise：异步的一等公民

\`\`\`javascript
function loadUser(id) {
  return fetch(\`/api/users/\${id}\`).then(async (res) => {
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  })
}
\`\`\`

钉死三件事：

1. \`then\` 返回**新** Promise，才能串联  
2. \`throw\` / \`reject\` 进 \`catch\`，\`ok: false\` 不会自动变异常——要自己判  
3. 别把重 CPU 逻辑塞进微任务链里「假装异步」

---

## 三、async/await：可读性换来的纪律

\`\`\`javascript
async function loadDashboard(userId) {
  try {
    const user = await loadUser(userId)
    const [orders, notices] = await Promise.all([
      loadOrders(userId),
      loadNotices(userId),
    ])
    return { user, orders, notices }
  } catch (error) {
    console.error('dashboard failed', error)
    throw error
  }
}
\`\`\`

### 串行 vs 并行（一张表记牢）

| 关系 | 写法 | 错误 |
|------|------|------|
| B 依赖 A | \`const a = await A; await B(a)\` | 强行 \`all\` 会缺参 |
| A∥B 无依赖 | \`Promise.all([A,B])\` | 全串行浪费 RTT |
| 要部分成功 | \`Promise.allSettled\` | 用 \`all\` 一挂全挂 |
| 要限流 | 池子 / p-limit | 千个请求打爆后端 |

教学用限流池：

\`\`\`javascript
async function mapPool(items, limit, worker) {
  const ret = []
  let i = 0
  const runners = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const cur = i++
      ret[cur] = await worker(items[cur], cur)
    }
  })
  await Promise.all(runners)
  return ret
}
\`\`\`

---

## 四、错误：让它冒泡到边界

1. **页面 / 路由级**统一接，中间层少空 \`catch\`  
2. 需要降级：\`catch\` 后返回明确 fallback，并打点  
3. \`finally\` 关 loading，不论成败  

> \`catch (() => {})\` 不是「稳健」，是把炸弹埋进日后的「为什么没数据」。

---

## 五、取消与竞态

\`\`\`javascript
const controller = new AbortController()
const data = await fetch(url, { signal: controller.signal }).then((r) => r.json())
// 路由离开：
controller.abort()
\`\`\`

UI 竞态用序号丢弃过期响应：

\`\`\`javascript
let seq = 0
async function load(id) {
  const my = ++seq
  const data = await api(id)
  if (my !== seq) return // 过期
  view.data = data
}
\`\`\`

---

## 六、反模式速查

| 写法 | 问题 |
|------|------|
| \`forEach(async …)\` | 不会等待 |
| 无脑每个请求都 \`await\` | 拖慢首屏 |
| \`catch(() => {})\` | 静默失败 |
| 失败的全局 Promise 当缓存 | 永久黑洞 |
| 顶层 await 塞进库入口 | 拖慢整图导入 |

---

## 七、怎么知道自己学会了

1. 画出某页请求的依赖图，标出可 \`all\` 的边。  
2. 说明 \`ok: false\` 为何不会进 \`catch\`。  
3. 用户连点切换详情，如何保证 UI 不被旧响应覆盖。  
4. \`forEach(async)\` 与 \`for…of + await\` 差在哪。

---

## 小结

async/await 让代码好看；你真正要设计的是 **依赖图、并发度、失败语义、取消与竞态**。把这四件事写进组件约定，异步才从「能跑」变成「可控」。
`

export default asyncAwaitContent
