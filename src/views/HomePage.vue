<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-greeting">Hi, I'm</span>
          <span class="title-name">星辰!</span>
        </h1>
        <p class="hero-subtitle">Hope my blog can help you ~</p>
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
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ categories.length }}</span>
              <span class="stat-label">分类</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ allTags.length }}</span>
              <span class="stat-label">标签</span>
            </div>
          </div>

          <!-- 导航菜单 -->
          <nav class="nav-section">
            <ul class="nav-list">
              <li class="nav-item active">
                <IconSvg name="home" :size="16" class="nav-icon" />
                <span class="nav-text">首页</span>
              </li>
              <li class="nav-item">
                <IconSvg name="document" :size="16" class="nav-icon" />
                <span class="nav-text">文章</span>
              </li>
              <li class="nav-item">
                <IconSvg name="user" :size="16" class="nav-icon" />
                <span class="nav-text">关于</span>
              </li>
              <li class="nav-item">
                <IconSvg name="music" :size="16" class="nav-icon" />
                <span class="nav-text">歌单</span>
              </li>
              <li class="nav-item">
                <IconSvg name="calendar" :size="16" class="nav-icon" />
                <span class="nav-text">日常</span>
              </li>
              <li class="nav-item dropdown">
                <IconSvg name="link" :size="16" class="nav-icon" />
                <span class="nav-text">更多网站</span>
                <span class="dropdown-arrow">▼</span>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- 最新文章 -->
      <main class="main-content">
        <section class="articles-section">
          <h2 class="section-title">最新文章</h2>
          <div class="article-list">
            <div
              v-for="blog in blogList"
              :key="blog.id"
              class="article-card"
              @click="goToBlog(blog.id)"
            >
              <div class="card-left">
                <div class="card-date-box">
                  <span class="date-day">{{ getDay(blog.date) }}</span>
                  <span class="date-month">{{ getMonthYear(blog.date) }}</span>
                </div>
              </div>
              <div class="card-right">
                <h3 class="card-title">{{ blog.title }}</h3>
                <div class="card-meta">
                  <span class="card-category">{{ blog.category }}</span>
                  <span class="card-tags">
                    <span v-for="tag in blog.tags" :key="tag" class="tag">{{ tag }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogs, getCategories, getTags } from '../api'
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'
import IconSvg from '../components/IconSvg.vue'

const router = useRouter()
const blogList = ref([])
const categories = ref([])
const allTags = ref([])

onMounted(async () => {
  const [blogs, cats, tags] = await Promise.all([
    getBlogs(),
    getCategories(),
    getTags(),
  ])
  blogList.value = blogs
  categories.value = cats.map(c => c.name)
  allTags.value = tags.map(t => t.name)
})

function goToBlog(id) {
  router.push({ name: 'BlogDetail', params: { id } })
}

function getDay(dateStr) {
  return dateStr.split('-')[2]
}

function getMonthYear(dateStr) {
  const [year, month] = dateStr.split('-')
  return `${year}.${month}`
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
  gap: 20px;
  padding: 20px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

/* 顶部渐变光泽线 */
.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), var(--color-accent), transparent);
  background-size: 200% auto;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.article-card:hover {
  border-color: transparent;
  box-shadow: var(--glow-card);
  transform: translateY(-6px) scale(1.01);
  background: linear-gradient(var(--color-bg-card), var(--color-bg-card)) padding-box,
              linear-gradient(135deg, var(--color-primary), var(--color-accent)) border-box;
  border: 1px solid transparent;
}

.article-card:hover::before {
  opacity: 1;
  animation: shimmer 2s linear infinite;
}

.article-card:hover .card-title {
  color: var(--color-primary);
}

.article-card:hover .card-date-box {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
}

.article-card:hover .date-day {
  color: #fff;
}

.article-card:hover .date-month {
  color: rgba(255, 255, 255, 0.8);
}

/* 左侧日期 */
.card-left {
  flex-shrink: 0;
}

.card-date-box {
  width: 60px;
  padding: 8px 0;
  text-align: center;
  border-radius: 8px;
  background: var(--color-primary-light);
  transition: all 0.35s ease;
}

.date-day {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
  transition: color 0.35s ease;
}

.date-month {
  display: block;
  font-family: 'Fira Code', monospace;
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
  transition: color 0.35s ease;
}

/* 右侧内容 */
.card-right {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  line-height: 1.4;
  transition: color 0.35s ease;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.card-category {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  transition: all 0.3s ease;
}

.article-card:hover .card-category {
  background: var(--color-primary);
  color: #fff;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.article-card:hover .tag {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
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

/* 侧边栏 active 脉冲光晕 */
@keyframes sidebar-active-glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(91, 141, 239, 0.1);
  }
  50% {
    box-shadow: 0 0 16px rgba(91, 141, 239, 0.25), 0 0 4px rgba(255, 126, 179, 0.15);
  }
}

/* 侧边栏 active 光条呼吸 */
@keyframes sidebar-bar-pulse {
  0%, 100% {
    opacity: 1;
    width: 3px;
  }
  50% {
    opacity: 0.7;
    width: 4px;
  }
}

/* nav-text 也加入过渡 */
.nav-text {
  flex: 1;
  text-align: left;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
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

  /* 移动端隐藏侧边栏 */
  .sidebar {
    display: none;
  }

  .article-card {
    gap: 14px;
    padding: 16px;
  }

  .card-date-box {
    width: 50px;
  }

  .date-day {
    font-size: 1.2rem;
  }
}
</style>