<template>
  <div class="layout">
    <!-- 背景动画 -->
    <CherryBlossomBg v-if="theme === 'light'" />
    <StarryBackground v-else />

    <!-- 顶部导航 -->
    <TopNav @open-drawer="drawerOpen = true" />

    <!-- 移动端侧边栏抽屉 -->
    <MobileDrawer :is-open="drawerOpen" @close="drawerOpen = false" />

    <!-- 阅读进度条 -->
    <ReadingProgress />

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import TopNav from '../components/TopNav.vue'
import CherryBlossomBg from '../components/CherryBlossomBg.vue'
import StarryBackground from '../components/StarryBackground.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import MobileDrawer from '../components/MobileDrawer.vue'

const { theme } = useTheme()
const drawerOpen = ref(false)
</script>

<style scoped>
.layout {
  min-height: 100vh;
  position: relative;
}

.main-content {
  padding-top: 56px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 56px;
  }
}
</style>
