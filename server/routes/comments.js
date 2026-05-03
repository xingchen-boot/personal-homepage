const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET /api/comments/:blogId - 获取文章评论
router.get('/:blogId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at DESC',
      [req.params.blogId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取评论失败' })
  }
})

// POST /api/comments/:blogId - 提交评论
router.post('/:blogId', async (req, res) => {
  try {
    const { author, content } = req.body
    if (!author || !content) {
      return res.status(400).json({ error: '作者和内容不能为空' })
    }

    // 检查文章是否存在
    const [blogs] = await pool.query('SELECT id FROM blogs WHERE id = ?', [req.params.blogId])
    if (blogs.length === 0) {
      return res.status(404).json({ error: '文章不存在' })
    }

    const [result] = await pool.query(
      'INSERT INTO comments (blog_id, author, content) VALUES (?, ?, ?)',
      [req.params.blogId, author, content]
    )
    res.status(201).json({ message: '评论提交成功', id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '提交评论失败' })
  }
})

module.exports = router
