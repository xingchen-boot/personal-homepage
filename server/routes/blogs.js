const express = require('express')
const router = express.Router()
const pool = require('../db')
const { withDateKey } = require('../utils/date')

function addWordCount(blog) {
  const text = (blog.content || '').replace(/[#*`\-\[\]()!>|\n\r]/g, '').trim()
  return withDateKey({ ...blog, wordCount: text.length })
}

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
    const blogs = rows.map(row => addWordCount({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
      viewCount: row.view_count || 0,
    }))
    res.json(blogs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
})

/**
 * GET /api/blogs/popular
 * 热门文章（按阅读量），必须写在 /:id 之前
 */
router.get('/popular', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20)
    const [rows] = await pool.query(
      `SELECT b.id, b.title, b.date, b.category, b.summary, b.view_count,
              GROUP_CONCAT(t.name) as tags
       FROM blogs b
       LEFT JOIN blog_tags bt ON b.id = bt.blog_id
       LEFT JOIN tags t ON bt.tag_id = t.id
       GROUP BY b.id
       ORDER BY b.view_count DESC, b.date DESC
       LIMIT ?`,
      [limit],
    )
    res.json(
      rows.map((row) =>
        addWordCount({
          ...row,
          tags: row.tags ? row.tags.split(',') : [],
          viewCount: row.view_count || 0,
        }),
      ),
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取热门文章失败' })
  }
})

/**
 * GET /api/blogs/:id/related
 * 相关推荐：同分类优先，其次共享标签；不足时用最新文章补齐
 */
router.get('/:id/related', async (req, res) => {
  try {
    const blogId = req.params.id
    const limit = Math.min(Number(req.query.limit) || 3, 10)

    const [currentRows] = await pool.query(
      `SELECT b.category, GROUP_CONCAT(t.name) AS tags
       FROM blogs b
       LEFT JOIN blog_tags bt ON b.id = bt.blog_id
       LEFT JOIN tags t ON bt.tag_id = t.id
       WHERE b.id = ?
       GROUP BY b.id`,
      [blogId],
    )
    if (currentRows.length === 0) {
      return res.status(404).json({ error: '文章不存在' })
    }

    const category = currentRows[0].category
    const currentTags = currentRows[0].tags ? currentRows[0].tags.split(',') : []

    // 先取一批候选，在 Node 侧打分，避免复杂动态 SQL
    const [candidates] = await pool.query(
      `SELECT b.id, b.title, b.date, b.category, b.summary, b.view_count,
              GROUP_CONCAT(t.name) AS tags
       FROM blogs b
       LEFT JOIN blog_tags bt ON b.id = bt.blog_id
       LEFT JOIN tags t ON bt.tag_id = t.id
       WHERE b.id <> ?
       GROUP BY b.id
       ORDER BY b.date DESC
       LIMIT 40`,
      [blogId],
    )

    const scored = candidates
      .map((row) => {
        const tags = row.tags ? row.tags.split(',') : []
        const sameCategory = row.category === category ? 2 : 0
        const sharedTags = tags.filter((tag) => currentTags.includes(tag)).length
        return {
          ...row,
          tags,
          viewCount: row.view_count || 0,
          score: sameCategory + Math.min(sharedTags, 3),
        }
      })
      .sort((a, b) => b.score - a.score || String(b.date).localeCompare(String(a.date)))

    const related = scored.filter((item) => item.score > 0).slice(0, limit)
    if (related.length < limit) {
      for (const item of scored) {
        if (related.length >= limit) break
        if (!related.find((picked) => picked.id === item.id)) {
          related.push(item)
        }
      }
    }

    res.json(related.map((row) => addWordCount(row)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取相关文章失败' })
  }
})

/**
 * POST /api/blogs/:id/view
 * 阅读量 +1（前端按会话去重后调用）
 */
router.post('/:id/view', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE blogs SET view_count = view_count + 1 WHERE id = ?',
      [req.params.id],
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '文章不存在' })
    }
    const [rows] = await pool.query('SELECT view_count FROM blogs WHERE id = ?', [req.params.id])
    res.json({ viewCount: rows[0].view_count })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新阅读量失败' })
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
    const blog = addWordCount({
      ...blogs[0],
      tags: blogs[0].tags ? blogs[0].tags.split(',') : [],
      viewCount: blogs[0].view_count || 0,
    })
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
