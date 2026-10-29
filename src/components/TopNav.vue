<template>
  <header class="top-nav">
    <div class="nav-container">
      <!-- 移动端汉堡菜单按钮 -->
      <button class="mobile-menu-btn" @click="$emit('openDrawer')">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

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
          <span>{{ t('nav.home') }}</span>
        </router-link>
        <div
          class="nav-dropdown"
          :class="{ active: isActive('/archive') || isActive('/tags') }"
        >
          <div class="nav-item nav-dropdown-trigger">
            <IconSvg name="document" :size="16" />
            <span>{{ t('nav.articles') }}</span>
            <span class="dropdown-arrow">▾</span>
          </div>
          <div class="nav-dropdown-menu">
            <router-link to="/archive" class="dropdown-item" :class="{ active: isActive('/archive') }">
              <IconSvg name="archive" :size="14" />
              <span>{{ t('nav.archive') }}</span>
            </router-link>
            <router-link to="/tags" class="dropdown-item" :class="{ active: isActive('/tags') }">
              <IconSvg name="tag" :size="14" />
              <span>{{ t('nav.tags') }}</span>
            </router-link>
          </div>
        </div>
        <a
          href="https://github.com/xingchen-boot"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-item"
        >
          <IconSvg name="github" :size="16" />
          <span>{{ t('nav.github') }}</span>
        </a>
        <router-link to="/about" class="nav-item" :class="{ active: isActive('/about') }">
          <IconSvg name="user" :size="16" />
          <span>{{ t('nav.about') }}</span>
        </router-link>
        <router-link to="/resume" class="nav-item" :class="{ active: isActive('/resume') }">
          <IconSvg name="document" :size="16" />
          <span>{{ t('nav.resume') }}</span>
        </router-link>
        <router-link to="/projects" class="nav-item" :class="{ active: isActive('/projects') }">
          <IconSvg name="archive" :size="16" />
          <span>{{ t('nav.projects') }}</span>
        </router-link>
        <!-- 次要入口收入「更多」：邮件降级，避免顶栏过挤 -->
        <div
          class="nav-dropdown"
          :class="{ active: isActive('/playlist') || isActive('/diary') || isActive('/links') }"
        >
          <div class="nav-item nav-dropdown-trigger">
            <IconSvg name="link" :size="16" />
            <span>{{ t('nav.more') }}</span>
            <span class="dropdown-arrow">▾</span>
          </div>
          <div class="nav-dropdown-menu">
            <a href="mailto:3141163409@qq.com" class="dropdown-item">
              <IconSvg name="mail" :size="14" />
              <span>{{ t('hero.ctaEmail') }}</span>
            </a>
            <router-link to="/playlist" class="dropdown-item" :class="{ active: isActive('/playlist') }">
              <IconSvg name="music" :size="14" />
              <span>{{ t('nav.playlist') }}</span>
            </router-link>
            <router-link to="/diary" class="dropdown-item" :class="{ active: isActive('/diary') }">
              <IconSvg name="calendar" :size="14" />
              <span>{{ t('nav.diary') }}</span>
            </router-link>
            <router-link to="/links" class="dropdown-item" :class="{ active: isActive('/links') }">
              <IconSvg name="link" :size="14" />
              <span>{{ t('nav.links') }}</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- 主题切换 + 语言切换 -->
      <div class="nav-actions">
        <!-- 搜索框 -->
        <SearchBox />
        <a
          href="mailto:3141163409@qq.com"
          class="theme-btn mail-btn"
          :title="t('hero.ctaEmail')"
          :aria-label="t('hero.ctaEmail')"
        >
          <IconSvg name="mail" :size="16" />
        </a>
        <button
          class="theme-btn"
          @click="toggleTheme"
          :title="theme === 'light' ? t('theme.toDark') : t('theme.toLight')"
        >
          <IconSvg :name="theme === 'light' ? 'moon' : 'sun'" :size="16" />
        </button>
        <!-- 仅暗色模式显示：开关 WebGL 星空（不支持时按钮禁用提示） -->
        <button
          v-if="theme === 'dark'"
          class="theme-btn"
          :class="{ active: preferWebGL && webglCapable }"
          :disabled="!webglCapable"
          :title="webglToggleTitle"
          @click="togglePreferWebGL"
        >
          <IconSvg name="sparkles" :size="16" />
        </button>
        <div class="lang-dropdown">
          <button class="theme-btn lang-btn" :title="'Language'">
            <IconSvg name="globe" :size="16" />
          </button>
          <div class="lang-menu">
            <button
              v-for="(name, code) in langNames"
              :key="code"
              class="lang-option"
              :class="{ active: currentLang === code }"
              @click="setLang(code)"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'
import { useWebGLBackground } from '../composables/useWebGLBackground'
import IconSvg from './IconSvg.vue'
import SearchBox from './SearchBox.vue'

// 定义 emits
defineEmits(['openDrawer'])

const route = useRoute()
const { theme, toggleTheme } = useTheme()
const { currentLang, t, setLang, langNames } = useI18n()
const { preferWebGL, webglCapable, togglePreferWebGL } = useWebGLBackground()

/** WebGL 开关按钮的提示文案 */
const webglToggleTitle = computed(() => {
  if (!webglCapable.value) return t('theme.webglUnavailable')
  return preferWebGL.value ? t('theme.webglOff') : t('theme.webglOn')
})

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

/* 文章下拉菜单 */
.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 0.6rem;
  margin-left: 2px;
  opacity: 0.6;
  transition: transform 0.2s ease;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 140px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 6px;
  box-shadow: var(--shadow-lg);
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.2s ease;
  /* 用 ::before 填补触发器和菜单之间的间隙 */
  pointer-events: none;
}

.nav-dropdown-menu::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  height: 12px;
}

.nav-dropdown:hover .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: var(--color-primary-light);
  color: var(--color-text);
}

.dropdown-item.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
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
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

a.theme-btn.mail-btn:hover {
  transform: scale(1.08);
}

.theme-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  color: var(--color-text);
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 0 12px rgba(91, 141, 239, 0.2);
}

.theme-btn.active {
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
}

.theme-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.auto-btn.active {
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
  box-shadow: 0 0 8px rgba(91, 141, 239, 0.2);
}

/* 语言切换下拉 */
.lang-dropdown {
  position: relative;
}

.lang-btn {
  font-size: 0.75rem;
  font-weight: 600;
}

.lang-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 4px;
  min-width: 80px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.lang-menu::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  height: 12px;
}

.lang-dropdown:hover .lang-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.lang-option {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.lang-option:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}

.lang-option.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}

/* 移动端汉堡菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text-secondary);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover .hamburger-line {
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .nav-container {
    margin-left: 0;
    margin-right: 0;
    padding: 0 16px;
    gap: 12px;
  }

  /* 显示汉堡菜单按钮 */
  .mobile-menu-btn {
    display: flex;
  }

  /* 隐藏桌面端导航链接 */
  .nav-links {
    display: none;
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
