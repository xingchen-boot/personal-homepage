/**
 * 将 MySQL DATE / Date / ISO 统一成 YYYY-MM-DD，避免 JSON 序列化成带 Z 的 ISO 导致前端差一天。
 */
function toDateKey(value) {
  if (value == null || value === '') return value
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const raw = String(value).trim()
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : raw
}

function withDateKey(row) {
  if (!row || typeof row !== 'object') return row
  return { ...row, date: toDateKey(row.date) }
}

module.exports = { toDateKey, withDateKey }
