<template>
  <div class="layout">
    <!-- 背景动画 -->
    <CherryBlossomBg v-if="theme === 'light'" />
    <StarryBackground v-else />

    <!-- 顶部导航 -->
    <TopNav />

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import TopNav from '../components/TopNav.vue'
import CherryBlossomBg from '../components/CherryBlossomBg.vue'
import StarryBackground from '../components/StarryBackground.vue'

const { theme } = useTheme()
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
