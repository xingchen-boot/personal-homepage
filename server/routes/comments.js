const express = require('express')
const router = express.Router()
const pool = require('../db')

/** 简单内存限流：同一 IP 在窗口内最多 N 次评论 */
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5
/** ip -> 时间戳数组 */
const commentHits = new Map()

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.ip || req.socket?.remoteAddress || 'unknown'
}

/**
 * 检查并记录评论频次
 * @returns {boolean} true 表示允许提交
 */
function allowComment(ip) {
  const now = Date.now()
  const recent = (commentHits.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    commentHits.set(ip, recent)
    return false
  }
  recent.push(now)
  commentHits.set(ip, recent)
  return true
}

// GET /api/comments/:blogId - 获取文章评论
router.get('/:blogId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at DESC',
      [req.params.blogId],
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取评论失败' })
  }
})

// POST /api/comments/:blogId - 提交评论（蜜罐 + 频次限制）
router.post('/:blogId', async (req, res) => {
  try {
    const { author, content, website } = req.body

    // 蜜罐字段：正常用户不可见，机器人常会填写 → 静默成功但不入库
    if (website) {
      return res.status(201).json({ message: '评论提交成功', id: 0 })
    }

    if (!author || !content) {
      return res.status(400).json({ error: '作者和内容不能为空' })
    }

    if (String(author).length > 40 || String(content).length > 2000) {
      return res.status(400).json({ error: '内容过长' })
    }

    const ip = getClientIp(req)
    if (!allowComment(ip)) {
      return res.status(429).json({ error: '评论太频繁，请稍后再试' })
    }

    const [blogs] = await pool.query('SELECT id FROM blogs WHERE id = ?', [req.params.blogId])
    if (blogs.length === 0) {
      return res.status(404).json({ error: '文章不存在' })
    }

    const [result] = await pool.query(
      'INSERT INTO comments (blog_id, author, content) VALUES (?, ?, ?)',
      [req.params.blogId, String(author).trim(), String(content).trim()],
    )
    res.status(201).json({ message: '评论提交成功', id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '提交评论失败' })
  }
})

module.exports = router
