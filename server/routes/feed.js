/**
 * RSS / Sitemap 路由
 * - GET /rss.xml
 * - GET /sitemap.xml
 */
const express = require('express')
const router = express.Router()
const pool = require('../db')

/** 站点公开地址，生产环境请在 .env 配置 SITE_URL */
function getSiteUrl() {
  return (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

function escapeXml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString()
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

router.get('/rss.xml', async (req, res) => {
  try {
    const siteUrl = getSiteUrl()
    const [rows] = await pool.query(
      'SELECT id, title, summary, date, updated_at FROM blogs ORDER BY date DESC LIMIT 50',
    )

    const items = rows
      .map((blog) => {
        const link = `${siteUrl}/blog/${encodeURIComponent(blog.id)}`
        return `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <description>${escapeXml(blog.summary || '')}</description>
    </item>`
      })
      .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>星辰の个人主页</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>前端学习、技术实践与生活记录</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

    res.type('application/rss+xml').send(xml)
  } catch (err) {
    console.error(err)
    res.status(500).type('text/plain').send('RSS 生成失败')
  }
})

router.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = getSiteUrl()
    const [rows] = await pool.query('SELECT id, date, updated_at FROM blogs ORDER BY date DESC')

    const staticPaths = ['/', '/archive', '/tags', '/about', '/resume', '/projects', '/links']
    const staticUrls = staticPaths
      .map(
        (path) => `
  <url>
    <loc>${escapeXml(siteUrl + path)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.6'}</priority>
  </url>`,
      )
      .join('')

    const blogUrls = rows
      .map((blog) => {
        const lastmod = toIsoDate(blog.updated_at || blog.date).slice(0, 10)
        return `
  <url>
    <loc>${escapeXml(`${siteUrl}/blog/${encodeURIComponent(blog.id)}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${blogUrls}
</urlset>`

    res.type('application/xml').send(xml)
  } catch (err) {
    console.error(err)
    res.status(500).type('text/plain').send('Sitemap 生成失败')
  }
})

module.exports = router
