<template>
  <div v-if="blog" class="blog-detail">
    <!-- 文章内容 -->
    <article class="article-content">
      <header class="article-header">
        <h1 class="article-title">{{ blog.title }}</h1>
        <div class="article-meta">
          <span class="meta-date">{{ blog.date }}</span>
          <span class="meta-category">{{ blog.category }}</span>
        </div>
        <div class="article-tags">
          <span v-for="tag in blog.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>
      <div class="article-body" v-html="renderedContent"></div>
    </article>

    <!-- 右侧目录 + 评论 -->
    <aside class="right-panel">
      <TableOfContents :content="blog.content" />
      <CommentSection />
    </aside>
  </div>

  <div v-else class="not-found">
    <p>{{ t('blog.notFound') }}</p>
    <router-link to="/" class="back-link">{{ t('blog.backHome') }}</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogById } from '../api'
import { useI18n } from '../composables/useI18n'
import TableOfContents from '../components/TableOfContents.vue'
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()
const { t } = useI18n()
const blog = ref(null)

onMounted(async () => {
  try {
    blog.value = await getBlogById(route.params.id)
  } catch {
    blog.value = null
  }
})

/**
 * 简易 Markdown 转 HTML
 */
const renderedContent = computed(() => {
  if (!blog.value) return ''
  let html = blog.value.content

  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="code-block"><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`
  })

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')

  // 列表
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // 段落
  html = html.replace(/^(?!<[hul]|<pre)(.+)$/gm, '<p>$1</p>')

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  return html
})

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
</script>

<style scoped>
.blog-detail {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* 文章内容 */
.article-content {
  min-width: 0;
}

.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.article-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-date,
.meta-category {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.meta-category {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

/* 文章正文 */
.article-body {
  line-height: 1.8;
  color: var(--color-text);
}

.article-body :deep(h2) {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 32px 0 16px;
  color: var(--color-text);
}

.article-body :deep(h3) {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 24px 0 12px;
  color: var(--color-text);
}

.article-body :deep(p) {
  margin-bottom: 16px;
  color: var(--color-text);
}

.article-body :deep(ul) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.article-body :deep(li) {
  margin-bottom: 8px;
  list-style: disc;
}

.article-body :deep(.code-block) {
  background: var(--color-bg-code);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #e8e6e3;
}

.article-body :deep(.inline-code) {
  background: var(--color-tag-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85em;
  color: var(--color-primary);
}

.article-body :deep(strong) {
  font-weight: 600;
  color: var(--color-text);
}

/* 右侧目录 */
.right-panel {
  position: sticky;
  top: 80px;
  align-self: start;
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 80px 24px;
}

.not-found p {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.back-link {
  color: var(--color-primary);
  font-size: 0.9rem;
}

.back-link:hover {
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .blog-detail {
    grid-template-columns: 1fr;
  }

  .right-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.4rem;
  }
}
</style>
