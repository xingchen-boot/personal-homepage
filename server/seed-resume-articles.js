/**
 * 将本地 resumeArticles / 关键博文写入 MySQL（可重复执行）
 * 用法：在 server 目录执行 node seed-resume-articles.js
 *
 * 数据源：前端 src/data/resumeArticles.js（单一事实来源）
 */
require('dotenv').config()
const path = require('path')
const { pathToFileURL } = require('url')
const mysql = require('mysql2/promise')

async function loadResumeArticles() {
  const fileUrl = pathToFileURL(
    path.join(__dirname, '../src/data/resumeArticles.js'),
  ).href
  const mod = await import(fileUrl)
  return mod.resumeArticles || []
}

async function main() {
  const articles = await loadResumeArticles()
  if (!articles.length) {
    throw new Error('未读到 resumeArticles')
  }

  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'personal_blog',
    multipleStatements: true,
  })

  const upsertSql = `
    INSERT INTO blogs (id, title, date, category, summary, content)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      date = VALUES(date),
      category = VALUES(category),
      summary = VALUES(summary),
      content = VALUES(content)
  `

  for (const article of articles) {
    await pool.query(upsertSql, [
      article.id,
      article.title,
      article.date,
      article.category,
      article.summary,
      article.content,
    ])

    // 同步标签（若存在 blog_tags 表则尽力写入）
    if (Array.isArray(article.tags) && article.tags.length) {
      try {
        await pool.query('DELETE FROM blog_tags WHERE blog_id = ?', [article.id])
        for (const tag of article.tags) {
          await pool.query(
            'INSERT IGNORE INTO tags (name) VALUES (?)',
            [tag],
          )
          const [tagRows] = await pool.query(
            'SELECT id FROM tags WHERE name = ? LIMIT 1',
            [tag],
          )
          if (tagRows[0]?.id) {
            await pool.query(
              'INSERT IGNORE INTO blog_tags (blog_id, tag_id) VALUES (?, ?)',
              [article.id, tagRows[0].id],
            )
          }
        }
      } catch {
        // 标签表结构差异时忽略，正文仍已写入
      }
    }
  }

  const ids = articles.map((item) => item.id)
  const [rows] = await pool.query(
    `SELECT id, title, CHAR_LENGTH(content) AS len FROM blogs WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids,
  )
  console.log(`已写入 / 更新 ${rows.length} 篇文章：`)
  rows.forEach((row) => {
    console.log(`- ${row.id}: ${row.title}（约 ${row.len} 字）`)
  })
  await pool.end()
}

main().catch((error) => {
  console.error('写入失败：', error.message)
  process.exit(1)
})
