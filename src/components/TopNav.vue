<template>
  <header class="top-nav">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="logo-icon">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: var(--icon-grad-start)" />
              <stop offset="100%" style="stop-color: var(--icon-grad-end)" />
            </linearGradient>
            <linearGradient id="logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: var(--color-primary)" />
              <stop offset="50%" style="stop-color: var(--color-accent)" />
              <stop offset="100%" style="stop-color: var(--color-primary)" />
            </linearGradient>
          </defs>
          <!-- 外圈装饰环 -->
          <circle cx="16" cy="16" r="14.5" stroke="url(#logo-ring)" stroke-width="1.2" fill="none" opacity="0.6" />
          <!-- 内圈 -->
          <circle cx="16" cy="16" r="12" stroke="url(#logo-grad)" stroke-width="1.5" fill="none" />
          <!-- 背景光晕 -->
          <circle cx="16" cy="16" r="10" fill="var(--icon-grad-start)" opacity="0.06" />
          <!-- 装饰花瓣 / 星角 -->
          <circle cx="16" cy="3" r="1.2" fill="var(--color-accent)" opacity="0.7" />
          <circle cx="27" cy="10" r="0.8" fill="var(--color-accent)" opacity="0.5" />
          <circle cx="27" cy="22" r="0.8" fill="var(--color-accent)" opacity="0.5" />
          <circle cx="16" cy="29" r="1.2" fill="var(--color-accent)" opacity="0.7" />
          <circle cx="5" cy="22" r="0.8" fill="var(--color-accent)" opacity="0.5" />
          <circle cx="5" cy="10" r="0.8" fill="var(--color-accent)" opacity="0.5" />
          <!-- xc 文字 -->
          <text x="16" y="20.5" text-anchor="middle" font-size="11" font-weight="700" font-family="'Fira Code', monospace" fill="url(#logo-grad)">xc</text>
        </svg>
      </router-link>

      <!-- 导航链接 -->
      <nav class="nav-links">
        <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
          <IconSvg name="home" :size="16" />
          <span>首页</span>
        </router-link>
        <router-link to="/archive" class="nav-item" :class="{ active: isActive('/archive') }">
          <IconSvg name="archive" :size="16" />
          <span>归档</span>
        </router-link>
        <router-link to="/tags" class="nav-item" :class="{ active: isActive('/tags') }">
          <IconSvg name="tag" :size="16" />
          <span>标签</span>
        </router-link>
        <a
          href="https://github.com/your-github"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-item"
        >
          <IconSvg name="github" :size="16" />
          <span>GitHub</span>
        </a>
      </nav>

      <!-- 主题切换 -->
      <div class="nav-actions">
        <button
          class="theme-btn"
          @click="toggleTheme"
          :title="theme === 'light' ? '切换到夜晚模式' : '切换到白天模式'"
        >
          <IconSvg :name="theme === 'light' ? 'moon' : 'sun'" :size="16" />
        </button>
        <button
          class="theme-btn auto-btn"
          :class="{ active: isAuto }"
          @click="setAutoMode"
          title="自动切换"
        >
          <IconSvg name="clock" :size="14" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import IconSvg from './IconSvg.vue'

const route = useRoute()
const { theme, isAuto, toggleTheme, setAutoMode } = useTheme()

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--color-bg-sidebar);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.nav-container {
  margin-left: 200px;
  margin-right: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.logo-icon {
  transition: all 0.3s ease;
}

.nav-logo:hover .logo-icon {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 0 6px var(--color-accent));
}

/* 导航链接 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 6px;
}

/* 非 active 项悬浮下划线动画 */
.nav-item:not(.active)::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 14px;
  right: 14px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-item:not(.active):hover::after {
  transform: scaleX(1);
}

.nav-item:hover {
  color: var(--color-text);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 141, 239, 0.15);
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item.active {
  color: var(--color-primary);
  font-weight: 500;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  box-shadow: 0 0 12px rgba(91, 141, 239, 0.2);
}

/* active 满下划线 */
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 14px;
  right: 14px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 1px;
  transform: scaleX(1);
}

/* 主题切换 - 推到右侧 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.theme-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.theme-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  color: var(--color-text);
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 0 12px rgba(91, 141, 239, 0.2);
}

.auto-btn.active {
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  box-shadow: 0 0 8px rgba(91, 141, 239, 0.2);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 6px 10px;
  }

  .logo-suffix {
    display: none;
  }
}
</style>
