/**
 * 日历日期工具：兼容 YYYY-MM-DD 与 API 返回的 ISO 时间。
 * MySQL DATE 经 JSON 常变成「本地零点的 UTC ISO」（如 +8 区 4/8 → 4/7T16:00Z），
 * 对带时区的 ISO 用本地年月日还原日历日。
 */

/** 取出日历日 YYYY-MM-DD */
export function toDateKey(value) {
  if (value == null || value === '') return ''
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const raw = String(value).trim()
  // 纯日历串：直接取前缀，不做时区换算
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  // ISO / 含时间：按本地日历日
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw) || raw.endsWith('Z')) {
    const dt = new Date(raw)
    if (!Number.isNaN(dt.getTime())) {
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const d = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  }
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : raw
}

/** 展示用：2026 年 4 月 8 日 */
export function formatDate(value) {
  const key = toDateKey(value)
  const m = key.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return key || ''
  return `${m[1]} 年 ${parseInt(m[2], 10)} 月 ${parseInt(m[3], 10)} 日`
}

/** 短展示：2026-04-08（搜索结果等） */
export function formatDateShort(value) {
  return toDateKey(value) || ''
}
