<template>
  <div class="home-page">
    <!-- Hero：定位一句 + 证据 + CTA（求职访客 10 秒叙事） -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-status">{{ t('hero.status') }}</p>
        <h1 class="hero-title">
          <span class="title-greeting">{{ t('hero.greeting') }}</span>
          <span class="title-name">{{ t('hero.name') }}</span>
        </h1>
        <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
        <p class="hero-evidence">{{ t('hero.evidence') }}</p>
        <div class="hero-actions">
          <router-link to="/resume" class="hero-btn">{{ t('hero.ctaResume') }}</router-link>
          <a :href="CONTACT_EMAIL" class="hero-btn ghost">{{ t('hero.ctaEmail') }}</a>
          <a href="#featured-projects" class="hero-btn ghost">{{ t('hero.ctaProjects') }}</a>
        </div>
      </div>
    </section>

    <!-- 内容区域：侧边栏 + 文章列表 -->
    <div class="content-wrapper">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <!-- 用户信息 -->
          <div class="profile-section">
            <div class="avatar">
              <img :src="avatar" alt="Avatar" />
            </div>
            <h3 class="profile-name">星辰</h3>
            <p class="profile-desc">{{ t('hero.status') }}</p>
          </div>

          <!-- 统计：次要信息，不抢叙事 -->
          <div class="stats-section">
            <div class="stat-item">
              <span class="stat-value">{{ blogList.length }}</span>
              <span class="stat-label">{{ t('sidebar.articles') }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ categories.length }}</span>
              <span class="stat-label">{{ t('sidebar.categories') }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ allTags.length }}</span>
              <span class="stat-label">{{ t('sidebar.tagCount') }}</span>
            </div>
          </div>

          <!-- 触达：简历 / GitHub / 邮件 -->
          <div class="quick-section">
            <h4 class="hot-title">{{ t('sidebar.quickLinks') }}</h4>
            <router-link to="/resume" class="quick-link">
              <IconSvg name="document" :size="14" />
              <span>{{ t('sidebar.resume') }}</span>
            </router-link>
            <router-link to="/projects" class="quick-link">
              <IconSvg name="archive" :size="14" />
              <span>{{ t('sidebar.projects') }}</span>
            </router-link>
            <a
              href="https://github.com/xingchen-boot"
              class="quick-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconSvg name="github" :size="14" />
              <span>{{ t('sidebar.github') }}</span>
            </a>
            <a :href="CONTACT_EMAIL" class="quick-link">
              <IconSvg name="mail" :size="14" />
              <span>{{ t('sidebar.email') }}</span>
            </a>
          </div>

          <!-- 热门文章 -->
          <div v-if="popularBlogs.length" class="hot-section">
            <h4 class="hot-title">{{ t('sidebar.hot') }}</h4>
            <router-link
              v-for="(item, index) in popularBlogs"
              :key="item.id"
              :to="{ name: 'BlogDetail', params: { id: item.id } }"
              class="hot-item"
            >
              <span class="hot-rank">{{ index + 1 }}</span>
              <span class="hot-name">{{ item.title }}</span>
            </router-link>
          </div>
        </div>
      </aside>

      <!-- 最新文章 -->
      <main class="main-content">
        <!-- 精选项目：问题 → 结果 → 复盘/外链 -->
        <section
          id="featured-projects"
          class="projects-preview"
          aria-labelledby="projects-preview-title"
        >
          <div class="preview-header">
            <h2 id="projects-preview-title" class="section-title">{{ t('home.featuredProjects') }}</h2>
            <router-link to="/projects" class="preview-more">{{ t('home.viewAllProjects') }} →</router-link>
          </div>
          <div class="preview-grid">
            <article v-for="project in featuredProjects" :key="project.id" class="preview-card">
              <div class="preview-card-top">
                <h3 class="preview-name">{{ project.name }}</h3>
                <span v-if="project.metric" class="preview-metric">{{ project.metric }}</span>
              </div>
              <dl class="preview-case" v-if="project.problem || project.result">
                <div v-if="project.problem" class="case-row">
                  <dt>{{ t('home.problem') }}</dt>
                  <dd>{{ project.problem }}</dd>
                </div>
                <div v-if="project.result" class="case-row">
                  <dt>{{ t('home.result') }}</dt>
                  <dd>{{ project.result }}</dd>
                </div>
              </dl>
              <p v-else class="preview-summary">{{ project.summary }}</p>
              <div class="preview-tags">
                <span v-for="tag in project.tags.slice(0, 4)" :key="tag" class="preview-tag">{{ tag }}</span>
              </div>
              <div class="preview-actions">
                <router-link
                  v-if="project.writeupId"
                  :to="{ name: 'BlogDetail', params: { id: project.writeupId } }"
                  class="preview-action"
                >
                  {{ t('home.readWriteup') }} →
                </router-link>
                <LocalNoteLink
                  v-if="project.link && isLocalOnlyLink(project)"
                  :url="project.link"
                  :label="project.linkLabel || t('home.localNote')"
                  ghost
                />
                <a
                  v-else-if="project.link"
                  :href="project.link"
                  class="preview-action ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ project.linkLabel || t('home.visitProject') }} →
                </a>
              </div>
            </article>
          </div>
        </section>

        <!-- 代表作深文：写作证明能力 -->
        <section
          v-if="featuredWriteups.length"
          class="writeups-section"
          aria-labelledby="writeups-title"
        >
          <div class="preview-header">
            <h2 id="writeups-title" class="section-title">{{ t('home.featuredWriteups') }}</h2>
            <router-link to="/archive" class="preview-more">{{ t('home.viewAllArticles') }} →</router-link>
          </div>
          <div class="writeup-list">
            <router-link
              v-for="post in featuredWriteups"
              :key="post.id"
              :to="{ name: 'BlogDetail', params: { id: post.id } }"
              class="writeup-card"
            >
              <span class="writeup-category">{{ post.category }}</span>
              <h3 class="writeup-title">{{ post.title }}</h3>
              <p class="writeup-summary">{{ post.summary }}</p>
              <span class="writeup-meta">{{ formatDate(post.date) }}</span>
            </router-link>
          </div>
        </section>

        <section class="articles-section">
          <h2 class="section-title">{{ t('home.latestArticles') }}</h2>

          <!-- 加载中：骨架屏 -->
          <div v-if="loading" class="skeleton-list" aria-busy="true" aria-label="文章加载中">
            <SkeletonLoader v-for="n in 3" :key="n" type="article-card" />
          </div>

          <!-- 空状态：无文章时引导去项目 / 简历 -->
          <div v-else-if="blogList.length === 0" class="empty-state">
            <p class="empty-title">{{ t('home.emptyTitle') }}</p>
            <p class="empty-desc">{{ t('home.emptyDesc') }}</p>
            <div class="empty-actions">
              <router-link to="/projects" class="empty-btn">{{ t('home.emptyProjects') }}</router-link>
              <router-link to="/resume" class="empty-btn ghost">{{ t('home.emptyResume') }}</router-link>
            </div>
          </div>

          <div v-else class="article-list">
            <!-- 使用 router-link：可右键新开、可键盘 Tab 聚焦，利于 SEO -->
            <router-link
              v-for="blog in paginatedBlogs"
              :key="blog.id"
              :to="{ name: 'BlogDetail', params: { id: blog.id } }"
              class="article-card"
            >
              <div class="card-cover">
                <img :src="blog.coverImage" :alt="blog.title" loading="lazy" />
              </div>
              <div class="card-body">
                <h3 class="card-title">{{ blog.title }}</h3>
                <p class="card-desc">{{ blog.summary || getContentPreview(blog.content) }}</p>
                <div class="card-meta-bottom">
                  <div class="card-info">
                    <span class="card-date">
                      <IconSvg name="calendar" :size="12" />
                      {{ formatDate(blog.date) }}
                    </span>
                    <span class="card-wordcount">
                      <IconSvg name="document" :size="12" />
                      {{ blog.wordCount }} {{ t('home.wordCount') }}
                    </span>
                    <span class="card-category">{{ blog.category }}</span>
                  </div>
                  <span class="card-tags">
                    <span v-for="tag in displayTags(blog)" :key="tag" class="tag">
                      <IconSvg name="tag" :size="10" />
                      {{ tag }}
                    </span>
                  </span>
                </div>
              </div>
            </router-link>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="totalPages > 1">
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              &lt;
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              &gt;
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { getBlogs, getCategories, getTags, getPopularBlogs } from '../api'
import { formatDate } from '../utils/date'
import { useI18n } from '../composables/useI18n'
import { projectList } from '../data/projects'
import { resumeArticles } from '../data/resumeArticles'
import { isLocalOnlyLink } from '../utils/localLink'
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'
import IconSvg from '../components/IconSvg.vue'
import LocalNoteLink from '../components/LocalNoteLink.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'

const { t } = useI18n()

/** 公开联系邮箱（与简历页一致） */
const CONTACT_EMAIL = 'mailto:3141163409@qq.com'

/** 首页代表作深文顺序 */
const WRITEUP_IDS = ['css-runtime-sinking', 'frontcode-ai-agent', 'virtual-list-streaming']

import articleImg1 from '../assets/article/19f34b7b2763512991d3012c2c2394dd.jpg'
import articleImg2 from '../assets/article/2c43c242b7dc175852bcaf06c689b97c.jpeg'
import articleImg3 from '../assets/article/38fc2516d476dabfc9f2a0664198a42d.jpg'
import articleImg4 from '../assets/article/3f67b6bbe601705401e1ae46970d668f.jpeg'
import articleImg5 from '../assets/article/5ade2c7b1b39bb37b5ac5cb2b6f52bba.jpeg'
import articleImg6 from '../assets/article/777e46be6d503e424b77dd379bc6170b.jpg'
import articleImg7 from '../assets/article/93b870b4f49223a184c8f8d659fcfa82.jpg'
import articleImg8 from '../assets/article/a7ac25b8e656dc2195a09afc267e9241.jpg'
import articleImg9 from '../assets/article/c46c2822f2f73129a8e910908b104cdc.jpeg'
import articleImg10 from '../assets/article/fca17c15ca649527e0a71f95ab7ba3ee.jpeg'
import articleImg11 from '../assets/article/Doro的三种含义 (1).png'

const coverImages = [
  articleImg1, articleImg2, articleImg3, articleImg4, articleImg5,
  articleImg6, articleImg7, articleImg8, articleImg9, articleImg10,
  articleImg11,
]

const blogList = ref([])
const categories = ref([])
const allTags = ref([])
const popularBlogs = ref([])

/** 首页展示前 3 个代表性项目（腾讯专项 + FrontCode + 问卷易） */
const featuredProjects = computed(() => {
  const preferredIds = ['tencent-css', 'frontcode', 'wenjuanyi']
  const picked = preferredIds
    .map((id) => projectList.find((item) => item.id === id))
    .filter(Boolean)
  return picked.length ? picked : projectList.slice(0, 3)
})

/** 代表作深文：优先 API 列表，缺省用本地 resumeArticles */
const featuredWriteups = computed(() => {
  return WRITEUP_IDS.map((id) => {
    const fromApi = blogList.value.find((b) => String(b.id) === id)
    if (fromApi) return fromApi
    return resumeArticles.find((b) => b.id === id)
  }).filter(Boolean)
})

const currentPage = ref(1)
const pageSize = 5
/** 首屏数据是否仍在加载 */
const loading = ref(true)

/** 最新列表去掉代表作深文，避免与上方区块重复 */
const feedBlogs = computed(() =>
  blogList.value.filter((b) => !WRITEUP_IDS.includes(String(b.id))),
)

const totalPages = computed(() => Math.ceil(feedBlogs.value.length / pageSize))

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return feedBlogs.value.slice(start, start + pageSize)
})

/** 标签与分类同名时去重，卡片上最多展示 4 个 */
function displayTags(blog) {
  return (blog?.tags || []).filter((tag) => tag && tag !== blog.category).slice(0, 4)
}

watch(currentPage, () => {
  nextTick(() => {
    document.querySelector('.articles-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
})

onMounted(async () => {
  loading.value = true
  try {
    const [blogs, cats, tags, popular] = await Promise.all([
      getBlogs(),
      getCategories(),
      getTags(),
      getPopularBlogs(5),
    ])
    blogList.value = blogs.map(blog => ({
      ...blog,
      coverImage: coverImages[Math.abs(hashCode(String(blog.id))) % coverImages.length],
    }))
    categories.value = cats.map(c => c.name)
    allTags.value = tags.map(t => t.name)
    popularBlogs.value = popular
  } finally {
    loading.value = false
  }
})

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function getContentPreview(content) {
  if (!content) return '暂无内容...'
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 120 ? text.slice(0, 120) + '...' : text
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* ========== Hero - 全宽，向上延伸覆盖导航栏 ========== */
.hero {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 520px;
  margin-top: -56px;
  padding: 72px 24px 48px;
  overflow: hidden;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: var(--color-text);
  max-width: 720px;
}

.hero-status {
  display: inline-block;
  margin: 0 0 16px;
  padding: 6px 14px;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border: 1px solid color-mix(in srgb, var(--color-primary) 28%, transparent);
  border-radius: 999px;
}

.hero-title {
  margin-bottom: 12px;
}

.title-greeting {
  display: block;
  font-size: 1.3rem;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 6px;
}

.title-name {
  display: block;
  font-size: 3.2rem;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-primary));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

.hero-subtitle {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0 auto 12px;
  max-width: 36em;
}

.hero-evidence {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  opacity: 0.85;
  margin: 0 auto 22px;
  max-width: 40em;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.hero-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.hero-btn.ghost {
  color: var(--color-text);
  background: var(--color-bg-card);
  border-color: var(--color-border);
}

.hero-btn.ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* ========== 内容区域布局 ========== */
.content-wrapper {
  display: flex;
  margin: 40px 200px 60px 200px;
  gap: 30px;
}

/* ========== 侧边栏 ========== */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 70px;
  height: fit-content;
}

.sidebar-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 24px;
  transition: all 0.4s ease;
}

.sidebar-card:hover {
  box-shadow: var(--glow-card);
  border-color: var(--color-primary);
}

/* 用户信息 */
.profile-section {
  text-align: center;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.avatar:hover img {
  transform: scale(1.1);
}

.avatar:hover {
  animation: pulse-glow 2s ease-in-out infinite;
}

.profile-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.profile-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.quick-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
}

.quick-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

/* 统计数据 */
.stats-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: default;
}

.stat-item:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
}

.stat-item:hover .stat-value {
  text-shadow: 0 0 12px rgba(91, 141, 239, 0.5);
  transform: scale(1.1);
  display: inline-block;
}

.stat-value {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* 导航菜单 */
.hot-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.hot-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}

.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  line-height: 1.45;
}

.hot-item:hover {
  color: var(--color-primary);
}

.hot-rank {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.72rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.hot-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nav-section {
  margin-top: 8px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  position: relative;
  overflow: hidden;
}

/* 背景渐变扫光（从左到右） */
.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-light), var(--color-accent-light), transparent);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: background-position 0.5s ease;
  border-radius: 8px;
  z-index: 0;
}

/* 左侧光条（从上滑入） */
.nav-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: 0 2px 2px 0;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
}

.nav-item:hover {
  color: var(--color-text);
  transform: translateX(6px);
  padding-left: 16px;
}

.nav-item:hover::before {
  background-position: 0 0;
}

.nav-item:hover::after {
  transform: scaleY(1);
}

.nav-item:hover .nav-icon {
  color: var(--color-primary);
  transform: scale(1.2) rotate(-8deg);
}

/* active 状态：常驻光条 + 背景 + 脉冲光晕 */
.nav-item.active {
  color: var(--color-primary);
  font-weight: 500;
  padding-left: 16px;
  animation: sidebar-active-glow 2.5s ease-in-out infinite;
}

.nav-item.active::before {
  background-position: 0 0;
}

.nav-item.active::after {
  transform: scaleY(1);
  animation: sidebar-bar-pulse 2s ease-in-out infinite;
}

.nav-item.active .nav-icon {
  color: var(--color-primary);
  transform: scale(1.1);
}

.nav-item.active .nav-icon {
  color: var(--color-primary);
}

.nav-icon {
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.dropdown-arrow {
  font-size: 0.6rem;
  opacity: 0.6;
  transition: all 0.3s ease;
  margin-left: auto;
}

/* 侧边栏下拉箭头旋转 */
.nav-dropdown.open .dropdown-arrow {
  transform: rotate(180deg);
}

/* 子菜单项（归档、标签） */
.nav-sub-item {
  padding-left: 28px;
  font-size: 0.85rem;
}

/* ========== 主内容区域 ========== */
.main-content {
  flex: 1;
  min-width: 0;
}

/* ========== 文章列表 ========== */
.articles-section {
  width: 100%;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 20px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  display: flex;
  height: 200px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.article-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.article-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

/* 项目预览区 */
.projects-preview {
  margin-bottom: 36px;
  scroll-margin-top: 72px;
}

.preview-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.preview-header .section-title {
  margin-bottom: 16px;
}

.preview-more {
  font-size: 0.85rem;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
  margin-bottom: 16px;
}

.preview-more:hover {
  text-decoration: underline;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.preview-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.preview-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.preview-card-top {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.preview-name {
  font-size: 0.92rem;
  font-weight: 650;
  color: var(--color-text);
  line-height: 1.4;
}

.preview-metric {
  align-self: flex-start;
  font-size: 0.72rem;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.preview-summary {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-case {
  margin: 0 0 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.case-row dt {
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 2px;
}

.case-row dd {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.preview-tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

.preview-action {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.preview-action:hover {
  text-decoration: underline;
}

.preview-action.ghost {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.writeups-section {
  margin-bottom: 36px;
}

.writeup-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.writeup-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.writeup-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.writeup-category {
  align-self: flex-start;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}

.writeup-title {
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.4;
  color: var(--color-text);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.writeup-summary {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.writeup-meta {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  opacity: 0.85;
}

.article-card:hover .card-cover img {
  transform: scale(1.06);
}

.article-card:hover .card-title {
  color: var(--color-primary);
}

/* 左侧封面图 */
.card-cover {
  width: 300px;
  flex-shrink: 0;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 右侧内容 */
.card-body {
  flex: 1;
  min-width: 0;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
  line-height: 1.5;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 14px;
  flex: 1;
}

.card-meta-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.card-date,
.card-wordcount {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.card-category {
  font-size: 0.72rem;
  padding: 2px 10px;
  border-radius: 12px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  white-space: nowrap;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

/* 空状态 */
.empty-state {
  padding: 48px 24px;
  text-align: center;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: 14px;
}

.empty-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 18px;
}

.empty-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.empty-btn {
  display: inline-flex;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  font-size: 0.88rem;
}

.empty-btn.ghost {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 文章卡片入场动画 */
.article-card {
  animation: card-enter 0.5s ease backwards;
}

.article-card:nth-child(1) { animation-delay: 0.1s; }
.article-card:nth-child(2) { animation-delay: 0.2s; }
.article-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1100px) {
  .preview-grid,
  .writeup-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 0;
    padding: 64px 16px 36px;
  }

  .title-greeting {
    font-size: 1rem;
  }

  .title-name {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .hero-evidence {
    font-size: 0.75rem;
  }

  .sidebar {
    display: none;
  }

  .content-wrapper {
    margin: 24px 16px 40px 16px;
  }

  .article-card {
    flex-direction: column;
  }

  .card-cover {
    width: 100%;
    height: 180px;
    border-radius: 12px 12px 0 0;
  }
}
</style>