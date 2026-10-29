<template>
  <!-- 搜索：文章 + 项目 + 简历技能锚点 -->
  <div class="search-box" :class="{ expanded: isExpanded }">
    <button class="search-trigger" @click="toggleSearch" title="搜索文章、项目、技能" aria-label="搜索">
      <IconSvg name="search" :size="16" />
    </button>

    <div class="search-input-wrapper" v-show="isExpanded">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索文章、项目、技能..."
        @input="handleSearch"
        @keyup.escape="closeSearch"
      />
      <button class="search-close" @click="closeSearch" aria-label="关闭搜索">
        <IconSvg name="close" :size="14" />
      </button>
    </div>

    <div class="search-results" v-show="isExpanded && searchQuery && searchResults.length > 0">
      <button
        v-for="result in searchResults"
        :key="result.key"
        type="button"
        class="search-result-item"
        @click="goToResult(result)"
      >
        <div class="result-title">
          <span class="result-kind">{{ result.kindLabel }}</span>
          {{ result.title }}
        </div>
        <div class="result-meta">
          <span v-if="result.meta" class="result-date">{{ result.meta }}</span>
          <span v-if="result.category" class="result-category">{{ result.category }}</span>
        </div>
      </button>
    </div>

    <div class="search-no-results" v-show="isExpanded && searchQuery && searchResults.length === 0">
      <span>未找到相关结果</span>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogs } from '../api'
import { formatDateShort } from '../utils/date'
import { projectList } from '../data/projects'
import IconSvg from './IconSvg.vue'

const router = useRouter()
const isExpanded = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)
let allBlogs = []

/** 简历技能 → 锚点（与 ResumePage 章节 id 对齐） */
const skillEntries = [
  { title: '前端框架', keywords: ['vue', 'pinia', 'vuex', 'router', '组件'], hash: 'skills' },
  { title: '工程化与规范', keywords: ['vite', 'webpack', 'eslint', 'prettier', 'git'], hash: 'skills' },
  { title: 'AI 前端应用', keywords: ['ai', 'agent', 'mcp', 'rag', 'openai', 'function calling'], hash: 'skills' },
  { title: '跨端与基础', keywords: ['qt', 'electron', 'typescript', 'javascript', 'http'], hash: 'skills' },
  { title: '实习经历', keywords: ['腾讯', '三七', '电信', '实习'], hash: 'experience' },
  { title: '教育背景', keywords: ['广工', '教育', 'gpa'], hash: 'education' },
]

function toggleSearch() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    loadBlogs()
  }
}

function closeSearch() {
  isExpanded.value = false
  searchQuery.value = ''
  searchResults.value = []
}

async function loadBlogs() {
  if (allBlogs.length === 0) {
    try {
      allBlogs = await getBlogs()
    } catch {
      allBlogs = []
    }
  }
}

function handleSearch() {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    searchResults.value = []
    return
  }

  const blogs = allBlogs
    .filter((blog) => {
      const titleMatch = blog.title?.toLowerCase().includes(query)
      const contentMatch = blog.content?.toLowerCase().includes(query)
      const tagMatch = blog.tags?.some((tag) => tag.toLowerCase().includes(query))
      const summaryMatch = blog.summary?.toLowerCase().includes(query)
      return titleMatch || contentMatch || tagMatch || summaryMatch
    })
    .slice(0, 6)
    .map((blog) => ({
      key: `blog-${blog.id}`,
      kind: 'blog',
      kindLabel: '文章',
      title: blog.title,
      meta: formatDateShort(blog.date),
      category: blog.category,
      id: blog.id,
    }))

  const projects = projectList
    .filter((p) => {
      const hay = [p.name, p.summary, p.problem, p.result, ...(p.tags || []), ...(p.highlights || [])]
        .join(' ')
        .toLowerCase()
      return hay.includes(query)
    })
    .slice(0, 4)
    .map((p) => ({
      key: `project-${p.id}`,
      kind: 'project',
      kindLabel: '项目',
      title: p.name,
      meta: p.metric || p.role,
      category: '',
      path: '/projects',
    }))

  const skills = skillEntries
    .filter((s) => {
      const hay = [s.title, ...s.keywords].join(' ').toLowerCase()
      return hay.includes(query) || s.keywords.some((k) => query.includes(k.toLowerCase()))
    })
    .slice(0, 3)
    .map((s) => ({
      key: `skill-${s.hash}-${s.title}`,
      kind: 'skill',
      kindLabel: '简历',
      title: s.title,
      meta: '跳转到简历章节',
      category: '',
      path: '/resume',
      hash: s.hash,
    }))

  searchResults.value = [...projects, ...skills, ...blogs].slice(0, 10)
}

function goToResult(result) {
  if (result.kind === 'blog') {
    router.push({ name: 'BlogDetail', params: { id: result.id } })
  } else if (result.hash) {
    router.push({ path: result.path, hash: `#${result.hash}` })
  } else {
    router.push(result.path || '/')
  }
  closeSearch()
}
</script>

<style scoped>
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-trigger {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.search-trigger:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.search-box.expanded .search-input-wrapper {
  display: flex;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
  padding: 0 8px;
  height: 32px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.search-input {
  width: 200px;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 0.85rem;
  outline: none;
}

.search-close {
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  padding: 2px;
}

.search-results,
.search-no-results {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(360px, calc(100vw - 24px));
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: var(--shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.12));
  z-index: 200;
  overflow: hidden;
}

.search-results {
  max-height: 360px;
  overflow-y: auto;
}

.search-result-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: var(--color-primary-light);
}

.result-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-kind {
  display: inline-block;
  margin-right: 6px;
  padding: 1px 6px;
  font-size: 0.65rem;
  font-weight: 500;
  border-radius: 999px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  vertical-align: middle;
}

.result-meta {
  display: flex;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
}

.result-category {
  padding: 0 6px;
  border-radius: 8px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

.search-no-results {
  padding: 16px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .search-input {
    width: 140px;
  }
}
</style>
