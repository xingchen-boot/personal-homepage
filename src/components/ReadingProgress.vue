<template>
  <!-- 阅读进度条组件 - 显示在页面顶部 -->
  <div class="reading-progress" v-show="isVisible">
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <span class="progress-text">{{ Math.round(progress) }}%</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 进度百分比
const progress = ref(0)
// 是否显示进度条
const isVisible = ref(false)

// 计算页面滚动进度
function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  // 避免除以 0 的情况
  if (docHeight <= 0) {
    progress.value = 0
    return
  }
  progress.value = (scrollTop / docHeight) * 100
  // 滚动超过 100px 时显示进度条
  isVisible.value = scrollTop > 100
}

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
/* 进度条容器 - 固定在页面顶部 */
.reading-progress {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-border);
  z-index: 99;
}

/* 进度条填充部分 */
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.1s ease;
  border-radius: 0 2px 2px 0;
}

/* 进度百分比文字 */
.progress-text {
  position: absolute;
  right: 12px;
  top: -20px;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-family: 'Fira Code', monospace;
  opacity: 0.8;
}
</style>
