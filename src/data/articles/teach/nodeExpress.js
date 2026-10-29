/** Node Express REST：Pi 精读章法 */
export const nodeExpressContent = `
![Express REST 封面](/blog/cover-generic.svg "路由、中间件、错误处理是三条脊梁")

> 很多 Express 教程停在 \`app.get\`。能上线的 API 要先钉死三件事：**分层、中间件管道、错误与状态码语义**。读完应能搭一套带校验与统一错误形状的 CRUD，而不是把 SQL 写进路由回调里。

---

## 一、请求怎么流过管道

\`\`\`
请求 → 日志 → 鉴权 → 校验 → 路由处理器 → 响应
                ↑ 出错时跳到错误中间件
\`\`\`

| 层 | 职责 | 不该做 |
|----|------|--------|
| Route | 解析 HTTP、调 service | 写复杂业务 |
| Service | 业务规则 | 关心 res.status |
| Repo | 数据库 | 拼 HTTP 错误文案 |

---

## 二、最小路由与异步错误

\`\`\`javascript
import express from 'express'
const app = express()
app.use(express.json())

app.get('/api/posts/:id', async (req, res, next) => {
  try {
    const post = await posts.get(req.params.id)
    if (!post) return res.status(404).json({ error: 'NOT_FOUND' })
    res.json(post)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.code || 'INTERNAL' })
})
\`\`\`

> Express 4 不会自动 catch async 抛错——要么 \`try/catch\`，要么包装函数。忘了这点，线上就是无声挂起或进程崩。

---

## 三、状态码别当心情符号

| 情况 | 状态码 |
|------|--------|
| 创建成功 | 201 + Location |
| 校验失败 | 400 / 422 |
| 未登录 | 401 |
| 无权限 | 403 |
| 无资源 | 404 |
| 冲突 | 409 |

错误响应用**稳定 machine code**（\`NOT_FOUND\`），文案给客户端自己翻译。

---

## 四、校验与安全底线

- body 用 zod / joi，失败直接 400  
- 限流、helmet、CORS 白名单  
- 密钥进环境变量，不进仓库  

---

## 五、怎么知道自己学会了

1. 为什么业务 SQL 不该写在 route 里？  
2. async 路由漏 \`next(err)\` 会怎样？  
3. 401 和 403 的语义差？  
4. 统一错误中间件解决了什么重复劳动？

---

## 小结

Express 好用在中间件模型；好维护靠 **分层 + 统一错误 + 明确状态码**。REST 是资源与语义的约定，不是只会 CRUD 四个字母。
`

export default nodeExpressContent
