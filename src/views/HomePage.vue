<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-greeting">{{ t('hero.greeting') }}</span>
          <span class="title-name">{{ t('hero.name') }}</span>
        </h1>
        <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
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
            <p class="profile-desc">You and Me</p>
          </div>

          <!-- 统计数据 -->
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

          <!-- 导航菜单 -->
          <nav class="nav-section">
            <ul class="nav-list">
              <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
                <IconSvg name="home" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('nav.home') }}</span>
              </router-link>
              <li class="nav-item nav-dropdown" :class="{ active: isActive('/archive') || isActive('/tags'), open: articleOpen }" @click="articleOpen = !articleOpen">
                <IconSvg name="document" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('sidebar.articles') }}</span>
                <span class="dropdown-arrow">▼</span>
              </li>
              <router-link to="/archive" class="nav-item nav-sub-item" :class="{ active: isActive('/archive') }" v-show="articleOpen">
                <IconSvg name="archive" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('nav.archive') }}</span>
              </router-link>
              <router-link to="/tags" class="nav-item nav-sub-item" :class="{ active: isActive('/tags') }" v-show="articleOpen">
                <IconSvg name="tag" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('nav.tags') }}</span>
              </router-link>
              <router-link to="/about" class="nav-item" :class="{ active: isActive('/about') }">
                <IconSvg name="user" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('sidebar.about') }}</span>
              </router-link>
              <router-link to="/playlist" class="nav-item" :class="{ active: isActive('/playlist') }">
                <IconSvg name="music" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('sidebar.playlist') }}</span>
              </router-link>
              <router-link to="/diary" class="nav-item" :class="{ active: isActive('/diary') }">
                <IconSvg name="calendar" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('sidebar.daily') }}</span>
              </router-link>
              <router-link to="/links" class="nav-item" :class="{ active: isActive('/links') }">
                <IconSvg name="link" :size="16" class="nav-icon" />
                <span class="nav-text">{{ t('sidebar.moreSites') }}</span>
              </router-link>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- 最新文章 -->
      <main class="main-content">
        <section class="articles-section">
          <h2 class="section-title">{{ t('home.latestArticles') }}</h2>
          <div class="article-list">
            <div
              v-for="blog in paginatedBlogs"
              :key="blog.id"
              class="article-card"
              @click="goToBlog(blog.id)"
            >
              <div class="card-cover">
                <img :src="blog.coverImage" :alt="blog.title" />
              </div>
              <div class="card-body">
                <h3 class="card-title">{{ blog.title }}</h3>
                <p class="card-desc">{{ getContentPreview(blog.content) }}</p>
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
                    <span v-for="tag in blog.tags" :key="tag" class="tag">
                      <IconSvg name="tag" :size="10" />
                      {{ tag }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBlogs, getCategories, getTags } from '../api'
import { useI18n } from '../composables/useI18n'
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'
import IconSvg from '../components/IconSvg.vue'

const { t } = useI18n()

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

const router = useRouter()
const route = useRoute()
const blogList = ref([])
const categories = ref([])
const allTags = ref([])

const articleOpen = ref(false)
const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() => Math.ceil(blogList.value.length / pageSize))

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return blogList.value.slice(start, start + pageSize)
})

onMounted(async () => {
  const [blogs, cats, tags] = await Promise.all([
    getBlogs(),
    getCategories(),
    getTags(),
  ])
  blogList.value = blogs.map(blog => ({
    ...blog,
    coverImage: coverImages[Math.abs(hashCode(blog.id)) % coverImages.length],
  }))
  categories.value = cats.map(c => c.name)
  allTags.value = tags.map(t => t.name)
})

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function goToBlog(id) {
  router.push({ name: 'BlogDetail', params: { id } })
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${year} 年 ${parseInt(month)} 月 ${parseInt(day)} 日`
}

function getContentPreview(content) {
  if (!content) return '暂无内容...'
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~`>|\-\[\]()!]/g, '')
    .replace(/\n+/g, ' ')
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
  height: 520px;
  margin-top: -56px;
  padding-top: 56px;
  overflow: hidden;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: var(--color-text);
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
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  animation: float 3s ease-in-out infinite;
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
  font-size: 0.85rem;
  color: var(--color-text-secondary);
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
}

.article-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
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

@media (max-width: 768px) {
  .hero {
    height: 360px;
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