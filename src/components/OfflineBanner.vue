<template>
  <!-- 后端不可用：轻提示，不抢首屏；本会话关闭后不再弹出 -->
  <transition name="banner-slide">
    <div v-if="visible" class="offline-banner" role="status">
      <span class="banner-text">当前展示本地示例内容（后端未连接）</span>
      <button class="banner-close" type="button" aria-label="关闭提示" @click="dismiss">
        ×
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { apiOffline } from '../api'

const STORAGE_KEY = 'offline-banner-dismissed'
const dismissed = ref(false)

onMounted(() => {
  try {
    dismissed.value = sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    dismissed.value = false
  }
})

/** 自动收起，避免长期压在 Hero 上 */
let hideTimer = 0
watch(
  apiOffline,
  (offline) => {
    if (!offline || dismissed.value) return
    window.clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => {
      dismiss()
    }, 6000)
  },
  { immediate: true },
)

function dismiss() {
  dismissed.value = true
  window.clearTimeout(hideTimer)
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

const visible = computed(() => apiOffline.value && !dismissed.value)
</script>

<style scoped>
.offline-banner {
  position: sticky;
  top: 56px;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 6px 16px;
  background: color-mix(in srgb, var(--color-bg-card) 88%, var(--color-text-secondary));
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  line-height: 1.4;
  opacity: 0.92;
}

.banner-close {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
  opacity: 0.7;
}

.banner-close:hover {
  opacity: 1;
  color: var(--color-text);
}

.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
