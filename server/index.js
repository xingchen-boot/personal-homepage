const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db')
const { ensureSchema } = require('./ensureSchema')
const blogsRouter = require('./routes/blogs')
const tagsRouter = require('./routes/tags')
const commentsRouter = require('./routes/comments')
const feedRouter = require('./routes/feed')

const app = express()
const PORT = process.env.SERVER_PORT || 3001

// CORS 配置 - 允许跨域请求
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// 信任代理，便于限流读取真实 IP（Railway / Nginx）
app.set('trust proxy', 1)

// 路由
app.use('/api/blogs', blogsRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/comments', commentsRouter)
app.use(feedRouter)

/**
 * GET /api/categories
 * 按文章 category 字段聚合
 */
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT category AS name, COUNT(*) AS count
      FROM blogs
      GROUP BY category
      ORDER BY count DESC
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取分类失败' })
  }
})

async function start() {
  try {
    await ensureSchema(pool)
  } catch (err) {
    console.error('[schema] 检查失败：', err.message)
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
