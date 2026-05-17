<template>
  <!-- 回到顶部按钮组件 -->
  <transition name="fade">
    <button
      v-show="isVisible"
      class="back-to-top"
      @click="scrollToTop"
      title="回到顶部"
    >
      <IconSvg name="arrow-up" :size="20" />
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconSvg from './IconSvg.vue'

// 是否显示按钮
const isVisible = ref(false)

// 更新按钮显示状态
function updateVisibility() {
  // 滚动超过 300px 时显示按钮
  isVisible.value = window.scrollY > 300
}

// 平滑滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<style scoped>
/* 回到顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.back-to-top:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(91, 141, 239, 0.3);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
