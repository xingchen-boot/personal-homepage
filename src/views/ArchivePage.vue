<template>
  <div class="archive-page">
    <div class="page-container">
      <h1 class="page-title">{{ t('archive.title') }}</h1>
      <p class="page-subtitle">{{ blogList.length }} {{ t('archive.totalArticles') }}</p>

      <div
        v-for="(blogs, year) in archives"
        :key="year"
        class="archive-year"
      >
        <h2 class="year-title">{{ year }}</h2>
        <div class="archive-list">
          <div
            v-for="blog in blogs"
            :key="blog.id"
            class="archive-item"
            @click="goToBlog(blog.id)"
          >
            <span class="item-date">{{ formatDate(blog.date) }}</span>
            <span class="item-title">{{ blog.title }}</span>
            <span class="item-category">{{ blog.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogs } from '../api'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const router = useRouter()
const blogList = ref([])

onMounted(async () => {
  blogList.value = await getBlogs()
})

const archives = computed(() => {
  const map = {}
  blogList.value.forEach(blog => {
    const year = blog.date.slice(0, 4)
    if (!map[year]) map[year] = []
    map[year].push(blog)
  })
  return map
})

function goToBlog(id) {
  router.push({ name: 'BlogDetail', params: { id } })
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${year} 年 ${parseInt(month)} 月 ${parseInt(day)} 日`
}
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
