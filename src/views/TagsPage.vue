<template>
  <div class="tags-page">
    <div class="page-container">
      <h1 class="page-title">{{ t('tags.title') }}</h1>
      <p class="page-subtitle">{{ t('tags.subtitle') }}</p>

      <!-- 标签云 -->
      <div class="tag-cloud">
        <button
          v-for="tag in tagList"
          :key="tag.name"
          class="tag-item"
          :class="{ active: selectedTag === tag.name }"
          @click="selectedTag = selectedTag === tag.name ? '' : tag.name"
        >
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </button>
      </div>

      <!-- 文章列表 -->
      <div class="tag-articles">
        <router-link
          v-for="blog in filteredBlogs"
          :key="blog.id"
          :to="{ name: 'BlogDetail', params: { id: blog.id } }"
          class="article-item"
        >
          <span class="article-date">{{ formatDate(blog.date) }}</span>
          <span class="article-title">{{ blog.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getBlogs, getTags } from '../api'
import { formatDate } from '../utils/date'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const selectedTag = ref('')
const blogList = ref([])
const tagList = ref([])

onMounted(async () => {
  const [blogs, tags] = await Promise.all([getBlogs(), getTags()])
  blogList.value = blogs
  tagList.value = tags
})

// 当选择标签时重新获取文章
watch(selectedTag, async (tag) => {
  if (tag) {
    blogList.value = await getBlogs({ tag })
  } else {
    blogList.value = await getBlogs()
  }
})

const filteredBlogs = computed(() => blogList.value)

</script>

<style scoped>
.tags-page {
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
  margin-bottom: 32px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.tag-item:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tag-item.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.tag-count {
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  opacity: 0.6;
}

.tag-articles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.article-item {
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

.article-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.article-item:hover {
  background: var(--color-primary-light);
}

.article-date {
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  min-width: 140px;
  white-space: nowrap;
}

.article-title {
  font-size: 0.95rem;
  color: var(--color-text);
}
</style>
