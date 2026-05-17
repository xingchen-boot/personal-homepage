// 根据环境变量决定 API 基础地址
// 开发环境使用 '/api'（通过 vite proxy 代理到本地后端）
// 生产环境使用 Railway 部署的后端地址
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

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

// 文章
export function getBlogs(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/blogs${query ? '?' + query : ''}`)
}

export function getBlogById(id) {
  return request(`/blogs/${id}`)
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

// 标签
export function getTags() {
  return request('/tags')
}

// 分类
export function getCategories() {
  return request('/categories')
}

// 评论
export function getComments(blogId) {
  return request(`/comments/${blogId}`)
}

export function postComment(blogId, data) {
  return request(`/comments/${blogId}`, { method: 'POST', body: JSON.stringify(data) })
}
