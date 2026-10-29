<template>
  <div class="archive-page">
    <div class="page-container">
      <h1 class="page-title">{{ t('archive.title') }}</h1>
      <p class="page-subtitle">{{ blogList.length }} {{ t('archive.totalArticles') }}</p>

      <div v-if="blogList.length === 0" class="empty-hint">
        暂无文章。后端离线时会自动使用本地示例数据，也可先查看
        <router-link to="/projects">项目</router-link>
        或
        <router-link to="/resume">简历</router-link>。
      </div>

      <div
        v-for="group in archives"
        :key="group.year"
        class="archive-year"
      >
        <h2 class="year-title">{{ group.year }}</h2>
        <div class="archive-list">
          <router-link
            v-for="blog in group.blogs"
            :key="blog.id"
            :to="{ name: 'BlogDetail', params: { id: blog.id } }"
            class="archive-item"
          >
            <span class="item-date">{{ formatDate(blog.date) }}</span>
            <span class="item-title">{{ blog.title }}</span>
            <span class="item-category">{{ blog.category }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBlogs } from '../api'
import { formatDate, toDateKey } from '../utils/date'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const blogList = ref([])

onMounted(async () => {
  blogList.value = await getBlogs()
})

const archives = computed(() => {
  const map = {}
  blogList.value.forEach((blog) => {
    const year = toDateKey(blog.date).slice(0, 4) || String(blog.date).slice(0, 4)
    if (!year) return
    if (!map[year]) map[year] = []
    map[year].push(blog)
  })
  // 用数组保证新年份在上（对象的整数键枚举序不稳定）
  return Object.keys(map)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, blogs: map[year] }))
})

</script>

<style scoped>
.archive-page {
  padding: 40px 24px;
}

.page-container {
  max-width: 700px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
}

.archive-year {
  margin-bottom: 36px;
}

.year-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.empty-hint {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px dashed var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.empty-hint a {
  color: var(--color-primary);
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.archive-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.archive-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.archive-item:hover {
  background: var(--color-primary-light);
}

.item-date {
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  min-width: 140px;
  white-space: nowrap;
}

.item-title {
  flex: 1;
  font-size: 0.95rem;
  color: var(--color-text);
}

.item-category {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

@media (max-width: 768px) {
  .archive-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .item-date {
    min-width: auto;
  }
}
</style>
