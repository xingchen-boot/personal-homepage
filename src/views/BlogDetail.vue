<template>
  <div v-if="blog" class="blog-detail">
    <!-- 左侧目录 -->
    <aside class="left-panel">
      <TableOfContents :content="blog.content" />
    </aside>

    <!-- 文章内容 -->
    <article class="article-content">
      <header class="article-header">
        <h1 class="article-title">{{ blog.title }}</h1>
        <div class="article-meta">
          <span class="meta-date">{{ formatDate(blog.date) }}</span>
          <span class="meta-category">{{ blog.category }}</span>
        </div>
        <div class="article-tags">
          <span v-for="tag in blog.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>
      <div class="article-body" v-html="renderedContent"></div>
      <CommentSection />
    </article>
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

  // 标题（带序号和 id 用于目录跳转）
  let h2Count = 0
  let h3Count = 0
  html = html.replace(/^#{2,3} (.+)$/gm, (match, text) => {
    if (match.startsWith('### ')) {
      h3Count++
      return `<h3 id="${text}">${h2Count}.${h3Count} ${text}</h3>`
    } else {
      h2Count++
      h3Count = 0
      return `<h2 id="${text}">${h2Count}. ${text}</h2>`
    }
  })

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

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${year} 年 ${parseInt(month)} 月 ${parseInt(day)} 日`
}
</script>

<style scoped>
.blog-detail {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  max-width: 1000px;
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
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
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
  font-size: 1rem;
  line-height: 2;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.article-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 40px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-text);
}

.article-body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 28px 0 14px;
  color: var(--color-text);
}

.article-body :deep(p) {
  margin-bottom: 20px;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 2;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-bottom: 20px;
  padding-left: 28px;
}

.article-body :deep(li) {
  margin-bottom: 10px;
  list-style: disc;
  line-height: 1.8;
}

.article-body :deep(.code-block) {
  background: var(--code-bg);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--code-text);
  border: 1px solid var(--code-border);
}

.article-body :deep(.inline-code) {
  background: rgba(91, 141, 239, 0.1);
  padding: 2px 8px;
  border-radius: 5px;
  font-family: 'Fira Code', monospace;
  font-size: 0.88em;
  color: var(--color-primary);
  border: 1px solid rgba(91, 141, 239, 0.15);
}

.article-body :deep(strong) {
  font-weight: 700;
  color: var(--color-text);
}

.article-body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-body :deep(a:hover) {
  color: var(--color-accent);
}

/* 左侧目录 */
.left-panel {
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

  .left-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.4rem;
  }
}
</style>
