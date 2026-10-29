/**
 * 将 src/data/blogs.js 全量文章 upsert 到 MySQL（可重复执行）
 * 用法：在 server 目录执行 node seed-all-articles.js
 */
require('dotenv').config()
const path = require('path')
const { pathToFileURL } = require('url')
const mysql = require('mysql2/promise')

async function syncTags(pool, article) {
  if (!Array.isArray(article.tags) || !article.tags.length) return
  try {
    await pool.query('DELETE FROM blog_tags WHERE blog_id = ?', [article.id])
    for (const tag of article.tags) {
      await pool.query('INSERT IGNORE INTO tags (name) VALUES (?)', [tag])
      const [tagRows] = await pool.query('SELECT id FROM tags WHERE name = ? LIMIT 1', [tag])
      if (tagRows[0]?.id) {
        await pool.query('INSERT IGNORE INTO blog_tags (blog_id, tag_id) VALUES (?, ?)', [
          article.id,
          tagRows[0].id,
        ])
      }
    }
  } catch {
    // 标签表结构差异时忽略，正文仍已写入
  }
}

async function main() {
  const blogsUrl = pathToFileURL(path.join(__dirname, '../src/data/blogs.js')).href
  const mod = await import(blogsUrl)
  const articles = mod.blogList || []
  if (!articles.length) throw new Error('blogList 为空')

  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'personal_blog',
    dateStrings: true,
  })

  const sql = `
    INSERT INTO blogs (id, title, date, category, summary, content)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title=VALUES(title),
      date=VALUES(date),
      category=VALUES(category),
      summary=VALUES(summary),
      content=VALUES(content)
  `

  for (const article of articles) {
    await pool.query(sql, [
      article.id,
      article.title,
      article.date,
      article.category,
      article.summary,
      article.content,
    ])
    await syncTags(pool, article)
  }

  const [rows] = await pool.query(
    'SELECT id, title, CHAR_LENGTH(content) AS len FROM blogs ORDER BY date DESC',
  )
  console.log(`已同步 ${articles.length} 篇到库（含标签），当前库内 ${rows.length} 篇：`)
  rows.forEach((row) => console.log(`- ${row.id}: ${row.len} 字 · ${row.title}`))
  await pool.end()
}

main().catch((error) => {
  console.error('同步失败：', error)
  process.exit(1)
})
