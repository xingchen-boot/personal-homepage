<template>
  <!-- 单一稳定根节点：避免加载态换根时与外层 transition 打架 -->
  <div class="blog-detail-page">
    <!-- 加载中：避免 blog 为 null 时误显示「文章不存在」 -->
    <div v-if="loading" class="not-found">
      <p>加载中…</p>
    </div>

    <!-- 文章详情页 -->
    <div v-else-if="blog" class="blog-detail">
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
            <span class="meta-views">{{ displayViews }} 次阅读</span>
          </div>
          <div class="article-tags">
            <span v-for="tag in displayTags(blog)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>

        <!-- 文章正文 -->
        <div class="article-body" v-html="renderedContent"></div>

        <!-- 对应项目：文章 → 作品集闭环 -->
        <aside v-if="relatedProject" class="related-project">
          <p class="related-project-label">对应项目</p>
          <div class="related-project-card">
            <div class="related-project-main">
              <h3 class="related-project-name">{{ relatedProject.name }}</h3>
              <p v-if="relatedProject.metric" class="related-project-metric">{{ relatedProject.metric }}</p>
              <p class="related-project-summary">{{ relatedProject.result || relatedProject.summary }}</p>
            </div>
            <router-link to="/projects" class="related-project-link">查看作品集 →</router-link>
          </div>
        </aside>

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

        <!-- 相关推荐 -->
        <section v-if="relatedBlogs.length" class="related-section">
          <h3 class="related-title">相关推荐</h3>
          <div class="related-list">
            <router-link
              v-for="item in relatedBlogs"
              :key="item.id"
              :to="{ name: 'BlogDetail', params: { id: item.id } }"
              class="related-item"
            >
              <span class="related-item-title">{{ item.title }}</span>
              <span class="related-item-meta">{{ item.category }}</span>
            </router-link>
          </div>
        </section>

        <!-- 评论区：离线时改为轻量联系引导，避免空表单 -->
        <CommentSection v-if="!apiOffline" />
        <aside v-else class="contact-fallback">
          <p class="contact-fallback-title">想交流这篇？</p>
          <p class="contact-fallback-desc">评论服务暂不可用，欢迎直接邮件联系。</p>
          <a href="mailto:3141163409@qq.com" class="contact-fallback-link">邮件联系 →</a>
        </aside>
      </article>
    </div>

    <!-- 未找到文章 -->
    <div v-else class="not-found">
      <p>{{ t('blog.notFound') }}</p>
      <router-link to="/" class="back-link">{{ t('blog.backHome') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { apiOffline, getBlogById, getBlogs, getRelatedBlogs, recordBlogView } from '../api'
import { formatDate } from '../utils/date'
import { useI18n } from '../composables/useI18n'
import { projectList } from '../data/projects'
import hljs from 'highlight.js'
import TableOfContents from '../components/TableOfContents.vue'
import CommentSection from '../components/CommentSection.vue'
import IconSvg from '../components/IconSvg.vue'

const route = useRoute()
const { t } = useI18n()
const blog = ref(null)
const loading = ref(true)
const prevBlog = ref(null)
const nextBlog = ref(null)
const relatedBlogs = ref([])
/** 本地展示的阅读量（含本次上报后的增量） */
const displayViews = ref(0)

/** 通过 writeupId 反查对应项目 */
const relatedProject = computed(() => {
  const id = String(route.params.id || '')
  return projectList.find((p) => p.writeupId && String(p.writeupId) === id) || null
})

/**
 * 加载当前文章及附属数据
 * 使用 watch 以便在同组件内切换文章 id 时重新拉取
 */
async function loadArticle(id) {
  loading.value = true
  blog.value = null
  prevBlog.value = null
  nextBlog.value = null
  relatedBlogs.value = []
  try {
    blog.value = await getBlogById(id)
    displayViews.value = blog.value?.viewCount || blog.value?.view_count || 0
    if (blog.value?.title) {
      document.title = `${blog.value.title} · 「星辰」の个人主页`
    }
    await Promise.all([loadAdjacentBlogs(), loadRelated(id)])
    const viewResult = await recordBlogView(id)
    if (viewResult?.viewCount != null) {
      displayViews.value = viewResult.viewCount
    }
    await nextTick()
    highlightCodeBlocks()
  } catch {
    blog.value = null
    relatedBlogs.value = []
  } finally {
    loading.value = false
  }
}

/** 标签与分类同名时去重，避免「性能优化」出现两次 */
function displayTags(blog) {
  return (blog?.tags || []).filter((tag) => tag && tag !== blog.category)
}

watch(
  () => route.params.id,
  (id) => {
    if (id) loadArticle(id)
  },
  { immediate: true },
)

async function loadRelated(id) {
  try {
    relatedBlogs.value = await getRelatedBlogs(id, 3)
  } catch {
    relatedBlogs.value = []
  }
}

// 加载相邻文章（上一篇和下一篇）
async function loadAdjacentBlogs() {
  try {
    const allBlogs = await getBlogs()
    const currentIndex = allBlogs.findIndex((b) => String(b.id) === String(route.params.id))
    prevBlog.value = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
    nextBlog.value =
      currentIndex >= 0 && currentIndex < allBlogs.length - 1
        ? allBlogs[currentIndex + 1]
        : null
  } catch {
    prevBlog.value = null
    nextBlog.value = null
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

  // 图片：![说明](/path.png "图注") —— 需在段落处理前完成
  html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) => {
    const caption = title || alt
    const safeAlt = escapeHtml(alt || '')
    const safeSrc = escapeHtml(src || '')
    const safeCaption = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''
    return `<figure class="article-figure"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" decoding="async" />${safeCaption}</figure>`
  })

  // 分隔线（Pi 精读常用 --- 分段）
  html = html.replace(/^---$/gm, '<hr class="article-hr" />')

  // 表格（GFM）：| a | b |
  html = html.replace(/(?:^\|.+\|[ \t]*\n){2,}/gm, (block) => {
    const lines = block.trim().split('\n').filter(Boolean)
    if (lines.length < 2) return block
    const splitRow = (line) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
    const isSep = (line) => /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line)
    const head = splitRow(lines[0])
    let bodyStart = 1
    if (isSep(lines[1])) bodyStart = 2
    const body = lines.slice(bodyStart).filter((line) => !isSep(line)).map(splitRow)
    const thead = `<thead><tr>${head.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>`
    const tbody = `<tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`
    return `<div class="article-table-wrap"><table class="article-table">${thead}${tbody}</table></div>\n`
  })

  // 引用块（单行 > 文本）
  html = html.replace(/^> (.+)$/gm, '<blockquote class="article-quote">$1</blockquote>')

  // 处理标题（已有「一、/1.」则不重复加序号；id 仍用原文便于目录）
  let h2Count = 0
  let h3Count = 0
  const alreadyNumbered = (text) =>
    /^(?:\d+[\.、．]|[一二三四五六七八九十百]+[、.．]|第[一二三四五六七八九十\d]+[章节篇])/.test(text.trim())
  html = html.replace(/^#{2,3} (.+)$/gm, (match, text) => {
    if (match.startsWith('### ')) {
      h3Count++
      const label = alreadyNumbered(text) ? text : `${h2Count}.${h3Count} ${text}`
      return `<h3 id="${text}">${label}</h3>`
    } else {
      h2Count++
      h3Count = 0
      const label = alreadyNumbered(text) ? text : `${h2Count}. ${text}`
      return `<h2 id="${text}">${label}</h2>`
    }
  })

  // 处理无序列表
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  // 处理有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // 处理段落（跳过已生成的块级标签）
  html = html.replace(/^(?!<[hulpf]|<pre|<figure|<div|<blockquote|<hr|<table)(.+)$/gm, '<p>$1</p>')

  // 普通链接 [文本](url)（图片语法已先行处理；站内相对路径不新开标签页）
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,
    (_, text, href) => {
      const external = /^https?:\/\//i.test(href)
      const attrs = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : ''
      return `<a href="${href}"${attrs}>${text}</a>`
    },
  )

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
.meta-reading-time,
.meta-views {
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

/* 正文配图 */
.article-body :deep(.article-figure) {
  margin: 28px 0 32px;
  text-align: center;
}

.article-body :deep(.article-figure img) {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  background: var(--color-bg-card);
}

.article-body :deep(.article-figure figcaption) {
  margin-top: 10px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.article-body :deep(blockquote.article-quote) {
  margin: 20px 0 28px;
  padding: 14px 18px;
  border-left: 3px solid var(--color-primary);
  border-radius: 0 10px 10px 0;
  background: color-mix(in srgb, var(--color-primary-light) 55%, var(--color-bg-card));
  color: var(--color-text);
}

.article-body :deep(hr.article-hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 36px 0;
}

.article-body :deep(.article-table-wrap) {
  overflow-x: auto;
  margin: 20px 0 28px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.article-body :deep(.article-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.article-body :deep(.article-table th),
.article-body :deep(.article-table td) {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  vertical-align: top;
  line-height: 1.55;
}

.article-body :deep(.article-table th) {
  background: color-mix(in srgb, var(--color-primary-light) 70%, var(--color-bg-card));
  font-weight: 650;
  color: var(--color-text);
}

.article-body :deep(.article-table td) {
  color: var(--color-text);
}

.article-body :deep(.article-table tr:last-child td) {
  border-bottom: none;
}

.related-project {
  margin: 36px 0 8px;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
}

.related-project-label {
  margin: 0 0 10px;
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.related-project-card {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.related-project-name {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 650;
  color: var(--color-text);
}

.related-project-metric {
  display: inline-block;
  margin: 0 0 8px;
  padding: 2px 8px;
  font-size: 0.72rem;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.related-project-summary {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  max-width: 36em;
}

.related-project-link {
  flex-shrink: 0;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.related-project-link:hover {
  text-decoration: underline;
}

.contact-fallback {
  margin-top: 40px;
  padding: 20px;
  border-radius: 12px;
  border: 1px dashed var(--color-border);
  background: var(--color-bg);
}

.contact-fallback-title {
  margin: 0 0 6px;
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--color-text);
}

.contact-fallback-desc {
  margin: 0 0 12px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.contact-fallback-link {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.contact-fallback-link:hover {
  text-decoration: underline;
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

.related-section {
  margin: 32px 0;
}

.related-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease;
}

.related-item:hover {
  border-color: var(--color-primary);
}

.related-item-title {
  font-size: 0.9rem;
  color: var(--color-text);
}

.related-item-meta {
  font-size: 0.75rem;
  color: var(--color-primary);
  white-space: nowrap;
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
    position: static;
    order: -1;
    margin-bottom: 8px;
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

  .article-body :deep(.code-block) {
    font-size: 0.78rem;
    padding: 14px;
  }

  .article-body :deep(.article-table) {
    font-size: 0.82rem;
  }

  .article-navigation {
    flex-direction: column;
  }

  .nav-link.next {
    text-align: left;
  }
}
</style>
