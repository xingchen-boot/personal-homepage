/**
 * 本机笔记地址（Astro 精读站等）：访客外网点不开，UI 上应提示而非当死链跳转。
 */

export function isLocalHostUrl(url) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(String(url || ''))
}

/** 是否应视为「仅本机」入口 */
export function isLocalOnlyLink(item) {
  if (!item) return false
  if (item.localOnly) return true
  return isLocalHostUrl(item.link || item.url)
}

/**
 * 复制本机地址；失败时返回 false
 * @returns {Promise<boolean>}
 */
export async function copyLocalUrl(url) {
  const text = String(url || '').trim()
  if (!text) return false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through */
  }
  try {
    const input = document.createElement('textarea')
    input.value = text
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(input)
    return ok
  } catch {
    return false
  }
}
