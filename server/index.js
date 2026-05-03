const express = require('express')
const cors = require('cors')
require('dotenv').config()

const blogsRouter = require('./routes/blogs')
const tagsRouter = require('./routes/tags')
const commentsRouter = require('./routes/comments')

const app = express()
const PORT = process.env.SERVER_PORT || 3001

app.use(cors())
app.use(express.json())

// 路由
app.use('/api/blogs', blogsRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/comments', commentsRouter)

// tags 路由也挂在 /api/categories 下
app.use('/api/categories', tagsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
