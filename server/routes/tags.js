const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET /api/tags - 所有标签及文章数
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.name, COUNT(bt.blog_id) as count
      FROM tags t
      LEFT JOIN blog_tags bt ON t.id = bt.tag_id
      GROUP BY t.id, t.name
      ORDER BY count DESC
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取标签失败' })
  }
})

// GET /api/categories - 所有分类及文章数
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT category as name, COUNT(*) as count
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

module.exports = router
