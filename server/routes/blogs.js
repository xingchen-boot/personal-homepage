const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET /api/blogs - 文章列表（支持 category/tag 筛选）
router.get('/', async (req, res) => {
  try {
    const { category, tag } = req.query
    let sql = `
      SELECT b.*, GROUP_CONCAT(t.name) as tags
      FROM blogs b
      LEFT JOIN blog_tags bt ON b.id = bt.blog_id
      LEFT JOIN tags t ON bt.tag_id = t.id
    `
    const params = []
    const conditions = []

    if (category) {
      conditions.push('b.category = ?')
      params.push(category)
    }
    if (tag) {
      conditions.push('t.name = ?')
      params.push(tag)
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' GROUP BY b.id ORDER BY b.date DESC'

    const [rows] = await pool.query(sql, params)
    const blogs = rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
    }))
    res.json(blogs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
})

// GET /api/blogs/:id - 文章详情
router.get('/:id', async (req, res) => {
  try {
    const [blogs] = await pool.query(
      `SELECT b.*, GROUP_CONCAT(t.name) as tags
       FROM blogs b
       LEFT JOIN blog_tags bt ON b.id = bt.blog_id
       LEFT JOIN tags t ON bt.tag_id = t.id
       WHERE b.id = ?
       GROUP BY b.id`,
      [req.params.id]
    )
    if (blogs.length === 0) {
      return res.status(404).json({ error: '文章不存在' })
    }
    const blog = {
      ...blogs[0],
      tags: blogs[0].tags ? blogs[0].tags.split(',') : [],
    }
    res.json(blog)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取文章详情失败' })
  }
})

// POST /api/blogs - 新建文章
router.post('/', async (req, res) => {
  try {
    const { id, title, date, category, summary, content, tags } = req.body
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
      await conn.query(
        'INSERT INTO blogs (id, title, date, category, summary, content) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title, date, category, summary, content]
      )

      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          await conn.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tagName])
          const [tagRows] = await conn.query('SELECT id FROM tags WHERE name = ?', [tagName])
          await conn.query('INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)', [id, tagRows[0].id])
        }
      }

      await conn.commit()
      res.status(201).json({ message: '文章创建成功', id })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '创建文章失败' })
  }
})

// PUT /api/blogs/:id - 更新文章
router.put('/:id', async (req, res) => {
  try {
    const { title, date, category, summary, content, tags } = req.body
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
      await conn.query(
        'UPDATE blogs SET title=?, date=?, category=?, summary=?, content=? WHERE id=?',
        [title, date, category, summary, content, req.params.id]
      )

      if (tags !== undefined) {
        await conn.query('DELETE FROM blog_tags WHERE blog_id = ?', [req.params.id])
        if (tags.length > 0) {
          for (const tagName of tags) {
            await conn.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tagName])
            const [tagRows] = await conn.query('SELECT id FROM tags WHERE name = ?', [tagName])
            await conn.query('INSERT INTO blog_tags (blog_id, tag_id) VALUES (?, ?)', [req.params.id, tagRows[0].id])
          }
        }
      }

      await conn.commit()
      res.json({ message: '文章更新成功' })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新文章失败' })
  }
})

// DELETE /api/blogs/:id - 删除文章
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '文章不存在' })
    }
    res.json({ message: '文章删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '删除文章失败' })
  }
})

module.exports = router
