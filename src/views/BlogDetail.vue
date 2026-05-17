<template>
  <!-- 文章详情页 -->
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
          <!-- 阅读时间 -->
          <span class="meta-reading-time">
            <IconSvg name="clock" :size="14" />
            约 {{ readingTime }} 分钟阅读
          </span>
        </div>
        <div class="article-tags">
          <span v-for="tag in blog.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <!-- 文章正文 -->
      <div class="article-body" v-html="renderedContent"></div>

      <!-- 上一篇/下一篇导航 -->
      <nav class="article-navigation" v-if="prevBlog || nextBlog">
        <router-link
          v-if="prevBlog"
          :to="{ name: 'BlogDetail', params: { id: prevBlog.id } }"
          class="nav-link prev"
        >
          <span class="nav-label">上一篇</span>
          <span class="nav-title">{{ prevBlog.title }}</span>
        </router-link>
        <div v-else class="nav-link placeholder"></div>
        <router-link
          v-if="nextBlog"
          :to="{ name: 'BlogDetail', params: { id: nextBlog.id } }"
          class="nav-link next"
        >
          <span class="nav-label">下一篇</span>
          <span class="nav-title">{{ nextBlog.title }}</span>
        </router-link>
        <div v-else class="nav-link placeholder"></div>
      </nav>

      <!-- 评论区 -->
      <CommentSection />
    </article>
  </div>

  <!-- 未找到文章 -->
  <div v-else class="not-found">
    <p>{{ t('blog.notFound') }}</p>
    <router-link to="/" class="back-link">{{ t('blog.backHome') }}</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogById, getBlogs } from '../api'
import { useI18n } from '../composables/useI18n'
import hljs from 'highlight.js'
import TableOfContents from '../components/TableOfContents.vue'
import CommentSection from '../components/CommentSection.vue'
import IconSvg from '../components/IconSvg.vue'

const route = useRoute()
const { t } = useI18n()
const blog = ref(null)
const prevBlog = ref(null)
const nextBlog = ref(null)

// 加载文章数据
onMounted(async () => {
  try {
    blog.value = await getBlogById(route.params.id)
    // 加载上下篇文章
    await loadAdjacentBlogs()
    // 等待 DOM 更新后高亮代码
    await nextTick()
    highlightCodeBlocks()
  } catch {
    blog.value = null
  }
})

// 加载相邻文章（上一篇和下一篇）
async function loadAdjacentBlogs() {
  try {
    const allBlogs = await getBlogs()
    const currentIndex = allBlogs.findIndex(b => b.id === route.params.id)
    if (currentIndex > 0) {
      prevBlog.value = allBlogs[currentIndex - 1]
    }
    if (currentIndex < allBlogs.length - 1) {
      nextBlog.value = allBlogs[currentIndex + 1]
    }
  } catch {
    // 静默失败，不影响文章显示
  }
}

// 计算阅读时间（按每分钟 300 字计算）
const readingTime = computed(() => {
  if (!blog.value?.content) return 1
  const wordCount = blog.value.content.length
  return Math.max(1, Math.ceil(wordCount / 300))
})

// Markdown 转 HTML（支持代码高亮）
const renderedContent = computed(() => {
  if (!blog.value) return ''
  let html = blog.value.content

  // 处理代码块 - 使用 highlight.js 进行语法高亮
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'plaintext'
    let highlighted
    try {
      // 尝试使用指定语言高亮
      if (hljs.getLanguage(language)) {
        highlighted = hljs.highlight(code.trim(), { language }).value
      } else {
        // 使用自动检测语言高亮
        highlighted = hljs.highlightAuto(code.trim()).value
      }
    } catch {
      // 高亮失败时使用转义后的纯文本
      highlighted = escapeHtml(code.trim())
    }
    return `<pre class="code-block"><code class="hljs language-${language}">${highlighted}</code></pre>`
  })

  // 处理标题（带序号和 id 用于目录跳转）
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

  // 处理无序列表
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  // 处理有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // 处理段落
  html = html.replace(/^(?!<[hul]|<pre)(.+)$/gm, '<p>$1</p>')

  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // 处理粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  return html
})

// HTML 转义函数
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 格式化日期
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${year} 年 ${parseInt(month)} 月 ${parseInt(day)} 日`
}

// 高亮代码块（用于动态加载的内容）
function highlightCodeBlocks() {
  document.querySelectorAll('.article-body pre code:not(.hljs)').forEach((block) => {
    hljs.highlightElement(block)
  })
}
</script>

<style scoped>
/* 文章详情布局 */
.blog-detail {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* 文章内容区域 */
.article-content {
  min-width: 0;
}

/* 文章头部 */
.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

/* 文章标题 */
.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
  line-height: 1.4;
}

/* 文章元信息 */
.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  align-items: center;
}

.meta-date,
.meta-category,
.meta-reading-time {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meta-category {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

/* 文章标签 */
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

/* 文章正文样式 */
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

/* 代码块样式 */
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

/* 行内代码样式 */
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

/* 上一篇/下一篇导航 */
.article-navigation {
  display: flex;
  gap: 16px;
  margin: 40px 0;
  padding: 24px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.nav-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 141, 239, 0.1);
}

.nav-link.next {
  text-align: right;
}

.nav-link.placeholder {
  background: transparent;
  border: none;
}

.nav-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.nav-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 左侧目录面板 */
.left-panel {
  position: sticky;
  top: 80px;
  align-self: start;
}

/* 未找到文章 */
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

/* 响应式布局 */
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

  .article-meta {
    flex-wrap: wrap;
    gap: 8px;
  }

  .article-navigation {
    flex-direction: column;
  }

  .nav-link.next {
    text-align: left;
  }
}
</style>
