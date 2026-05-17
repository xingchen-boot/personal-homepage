<template>
  <!-- 搜索框组件 -->
  <div class="search-box" :class="{ expanded: isExpanded }">
    <!-- 搜索图标按钮 -->
    <button class="search-trigger" @click="toggleSearch" :title="'搜索文章'">
      <IconSvg name="search" :size="16" />
    </button>

    <!-- 搜索输入框 -->
    <div class="search-input-wrapper" v-show="isExpanded">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索文章标题、内容、标签..."
        @input="handleSearch"
        @keyup.escape="closeSearch"
      />
      <button class="search-close" @click="closeSearch">
        <IconSvg name="close" :size="14" />
      </button>
    </div>

    <!-- 搜索结果下拉 -->
    <div class="search-results" v-show="isExpanded && searchQuery && searchResults.length > 0">
      <div
        v-for="result in searchResults"
        :key="result.id"
        class="search-result-item"
        @click="goToBlog(result.id)"
      >
        <div class="result-title">{{ result.title }}</div>
        <div class="result-meta">
          <span class="result-date">{{ result.date }}</span>
          <span class="result-category">{{ result.category }}</span>
        </div>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div class="search-no-results" v-show="isExpanded && searchQuery && searchResults.length === 0">
      <span>未找到相关文章</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogs } from '../api'
import IconSvg from './IconSvg.vue'

const router = useRouter()
const isExpanded = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)
let allBlogs = []

// 切换搜索框显示状态
function toggleSearch() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    loadBlogs()
  }
}

// 关闭搜索框
function closeSearch() {
  isExpanded.value = false
  searchQuery.value = ''
  searchResults.value = []
}

// 加载所有文章数据
async function loadBlogs() {
  if (allBlogs.length === 0) {
    try {
      allBlogs = await getBlogs()
    } catch {
      allBlogs = []
    }
  }
}

// 处理搜索
function handleSearch() {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    searchResults.value = []
    return
  }

  // 按标题、内容、标签进行搜索匹配
  searchResults.value = allBlogs.filter(blog => {
    const titleMatch = blog.title?.toLowerCase().includes(query)
    const contentMatch = blog.content?.toLowerCase().includes(query)
    const tagMatch = blog.tags?.some(tag => tag.toLowerCase().includes(query))
    return titleMatch || contentMatch || tagMatch
  }).slice(0, 10) // 限制最多显示 10 条结果
}

// 跳转到文章详情
function goToBlog(id) {
  router.push({ name: 'BlogDetail', params: { id } })
  closeSearch()
}
</script>

<style scoped>
/* 搜索框容器 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

/* 搜索触发按钮 */
.search-trigger {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.search-trigger:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* 搜索输入框容器 */
.search-input-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  margin-top: 8px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 300;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 搜索输入框 */
.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 0.9rem;
  color: var(--color-text);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

/* 关闭按钮 */
.search-close {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
}

.search-close:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* 搜索结果下拉 */
.search-results {
  position: absolute;
  top: calc(100% + 52px);
  right: 0;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 300;
}

/* 搜索结果项 */
.search-result-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-result-item:hover {
  background: var(--color-primary-light);
}

.result-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.result-category {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

/* 无结果提示 */
.search-no-results {
  position: absolute;
  top: calc(100% + 52px);
  right: 0;
  width: 320px;
  padding: 24px;
  text-align: center;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 300;
}

.search-no-results span {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .search-input-wrapper,
  .search-results,
  .search-no-results {
    width: 280px;
  }
}
</style>
