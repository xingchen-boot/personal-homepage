<template>
  <!-- 移动端侧边栏抽屉组件 -->
  <div class="mobile-drawer">
    <!-- 遮罩层 -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="drawer-overlay"
        @click="close"
      ></div>
    </transition>

    <!-- 抽屉内容 -->
    <transition name="slide">
      <div v-if="isOpen" class="drawer-content">
        <!-- 用户信息 -->
        <div class="drawer-header">
          <div class="drawer-avatar">
            <img :src="avatar" alt="Avatar" />
          </div>
          <h3 class="drawer-name">星辰</h3>
          <p class="drawer-desc">前端开发 · 腾讯实习</p>
        </div>

        <!-- 导航菜单 -->
        <nav class="drawer-nav">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="drawer-menu-item"
            :class="{ active: isActive(item.path) }"
            @click="close"
          >
            <IconSvg :name="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- 关闭按钮 -->
        <button class="drawer-close" @click="close">
          <IconSvg name="close" :size="20" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import avatar from '../assets/20230311003752_5b225.thumb.400_0.jpg'
import IconSvg from './IconSvg.vue'

const route = useRoute()

// 菜单项配置
const menuItems = [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/archive', icon: 'archive', label: '归档' },
  { path: '/tags', icon: 'tag', label: '标签' },
  { path: '/about', icon: 'user', label: '关于' },
  { path: '/resume', icon: 'document', label: '简历' },
  { path: '/projects', icon: 'archive', label: '项目' },
  { path: '/playlist', icon: 'music', label: '歌单' },
  { path: '/diary', icon: 'calendar', label: '日记' },
  { path: '/links', icon: 'link', label: '友链' },
]

// 判断当前路由是否激活
function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// 定义 props
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// 定义 emits
const emit = defineEmits(['close'])

// 关闭抽屉
function close() {
  emit('close')
}
</script>

<style scoped>
/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  backdrop-filter: blur(4px);
}

/* 抽屉内容 */
.drawer-content {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--color-bg-card);
  z-index: 201;
  overflow-y: auto;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
}

/* 抽屉头部 */
.drawer-header {
  padding: 32px 24px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.drawer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 3px solid var(--color-primary);
}

.drawer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.drawer-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

/* 导航菜单 */
.drawer-nav {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.drawer-menu-item:hover {
  background: var(--color-primary-light);
  color: var(--color-text);
}

.drawer-menu-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

/* 关闭按钮 */
.drawer-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.drawer-close:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
