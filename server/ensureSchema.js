/**
 * 启动时确保必要字段存在（兼容未跑过 migrate 的环境）
 * MySQL 8 部分版本不支持 ADD COLUMN IF NOT EXISTS，故用 information_schema 判断
 */
async function ensureSchema(pool) {
  const database = process.env.DB_NAME || 'personal_blog'

  const [columns] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'blogs' AND COLUMN_NAME = 'view_count'`,
    [database],
  )

  if (columns.length === 0) {
    await pool.query(
      'ALTER TABLE blogs ADD COLUMN view_count INT NOT NULL DEFAULT 0 AFTER content',
    )
    console.log('[schema] 已添加 blogs.view_count 字段')
  }
}

module.exports = { ensureSchema }
