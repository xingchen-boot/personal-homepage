<template>
  <div class="layout">
    <!-- 背景动画：亮色樱花；暗色 WebGL 星空（可降级 2D） -->
    <CherryBlossomBg v-if="theme === 'light'" />
    <DarkSkyBackground v-else />

    <!-- 顶部导航 -->
    <TopNav @open-drawer="drawerOpen = true" />

    <!-- 移动端侧边栏抽屉 -->
    <MobileDrawer :is-open="drawerOpen" @close="drawerOpen = false" />

    <!-- 阅读进度条 -->
    <ReadingProgress />

    <!-- API 离线提示 -->
    <OfflineBanner />

    <!-- 主内容区：不用 transition（多根/加载态换根时 fade-enter-from 会卡住 → 整页 opacity:0 空白） -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />

    <!-- 本地问答助手（无 API Key） -->
    <LocalAgentChat />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import TopNav from '../components/TopNav.vue'
import CherryBlossomBg from '../components/CherryBlossomBg.vue'
import DarkSkyBackground from '../components/DarkSkyBackground.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import MobileDrawer from '../components/MobileDrawer.vue'
import OfflineBanner from '../components/OfflineBanner.vue'
import LocalAgentChat from '../components/LocalAgentChat.vue'

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
