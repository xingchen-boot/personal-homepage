/**
 * API 请求封装
 * - 开发环境走 vite proxy（/api）
 * - 生产环境走 VITE_API_BASE_URL
 * - 请求失败时自动回退到本地静态数据，保证页面可浏览
 */
import { ref } from 'vue'
import { blogList as staticBlogList } from '../data/blogs'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** 当前是否处于「API 不可用，已使用本地示例数据」状态 */
export const apiOffline = ref(false)

/**
 * 计算纯文本字数（去掉空白）
 * @param {string} content
 * @returns {number}
 */
function computeWordCount(content) {
  return (content || '').replace(/\s/g, '').length
}

/**
 * 将静态文章规范成与后端接口一致的字段结构
 * @param {object} blog
 */
function normalizeStaticBlog(blog) {
  return {
    ...blog,
    wordCount: blog.wordCount ?? computeWordCount(blog.content),
  }
}

/**
 * 从静态数据中筛选文章
 * @param {{ category?: string, tag?: string }} params
 */
function getStaticBlogs(params = {}) {
  let list = staticBlogList.map(normalizeStaticBlog)

  if (params.category) {
    list = list.filter((blog) => blog.category === params.category)
  }
  if (params.tag) {
    list = list.filter((blog) => (blog.tags || []).includes(params.tag))
  }

  // 按日期倒序，贴近常见博客列表行为
  return list.sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

/**
 * 从静态文章聚合标签（含出现次数）
 */
function getStaticTags() {
  const countMap = new Map()
  staticBlogList.forEach((blog) => {
    ;(blog.tags || []).forEach((tagName) => {
      countMap.set(tagName, (countMap.get(tagName) || 0) + 1)
    })
  })
  return Array.from(countMap.entries()).map(([name, count]) => ({ name, count }))
}

/**
 * 从静态文章聚合分类
 */
function getStaticCategories() {
  const names = [...new Set(staticBlogList.map((blog) => blog.category).filter(Boolean))]
  return names.map((name) => ({ name }))
}

async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }))
    throw new Error(err.error || '请求失败')
  }
  return res.json()
}

/**
 * 带兜底的请求：网络/后端失败时执行 fallback，并标记离线
 * @template T
 * @param {() => Promise<T>} remoteCall
 * @param {() => T} fallbackFactory
 * @returns {Promise<T>}
 */
async function withFallback(remoteCall, fallbackFactory) {
  try {
    const data = await remoteCall()
    apiOffline.value = false
    return data
  } catch (error) {
    console.warn('[api] 远程接口不可用，已回退本地数据：', error?.message || error)
    apiOffline.value = true
    return fallbackFactory()
  }
}

// ---------- 文章 ----------

export function getBlogs(params = {}) {
  const query = new URLSearchParams(params).toString()
  return withFallback(
    () => request(`/blogs${query ? `?${query}` : ''}`),
    () => getStaticBlogs(params),
  )
}

export function getBlogById(id) {
  return withFallback(
    () => request(`/blogs/${id}`),
    () => {
      const blog = staticBlogList.find((item) => String(item.id) === String(id))
      if (!blog) throw new Error('文章不存在')
      return normalizeStaticBlog(blog)
    },
  )
}

/**
 * 热门文章（按阅读量）；离线时退回按日期排序
 */
export function getPopularBlogs(limit = 5) {
  return withFallback(
    () => request(`/blogs/popular?limit=${limit}`),
    () => getStaticBlogs().slice(0, limit).map((blog) => ({ ...blog, viewCount: blog.viewCount || 0 })),
  )
}

/**
 * 相关文章推荐
 */
export function getRelatedBlogs(id, limit = 3) {
  return withFallback(
    () => request(`/blogs/${id}/related?limit=${limit}`),
    () => {
      const current = staticBlogList.find((item) => String(item.id) === String(id))
      if (!current) return getStaticBlogs().filter((blog) => String(blog.id) !== String(id)).slice(0, limit)
      const others = getStaticBlogs().filter((blog) => String(blog.id) !== String(id))
      const scored = others
        .map((blog) => {
          const sameCategory = blog.category === current.category ? 2 : 0
          const shared = (blog.tags || []).filter((tag) => (current.tags || []).includes(tag)).length
          return { ...blog, score: sameCategory + shared }
        })
        .sort((a, b) => b.score - a.score)
      return scored.slice(0, limit)
    },
  )
}

/**
 * 记录阅读量（每篇文章每个浏览器会话只上报一次）
 */
export async function recordBlogView(id) {
  const storageKey = `viewed:${id}`
  try {
    if (sessionStorage.getItem(storageKey)) return null
    sessionStorage.setItem(storageKey, '1')
  } catch {
    // sessionStorage 不可用时仍尝试上报
  }
  try {
    return await request(`/blogs/${id}/view`, { method: 'POST', body: '{}' })
  } catch {
    return null
  }
}

export function createBlog(data) {
  return request('/blogs', { method: 'POST', body: JSON.stringify(data) })
}

export function updateBlog(id, data) {
  return request(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteBlog(id) {
  return request(`/blogs/${id}`, { method: 'DELETE' })
}

// ---------- 标签 / 分类 ----------

export function getTags() {
  return withFallback(() => request('/tags'), getStaticTags)
}

export function getCategories() {
  return withFallback(() => request('/categories'), getStaticCategories)
}

// ---------- 评论（写操作不兜底；读失败返回空列表） ----------

export function getComments(blogId) {
  return withFallback(
    () => request(`/comments/${blogId}`),
    () => [],
  )
}

export function postComment(blogId, data) {
  return request(`/comments/${blogId}`, { method: 'POST', body: JSON.stringify(data) })
}
