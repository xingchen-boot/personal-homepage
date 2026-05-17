<template>
  <!-- 404 页面 -->
  <div class="not-found-page">
    <div class="not-found-content">
      <!-- 404 动画图标 -->
      <div class="error-icon">
        <span class="error-number">4</span>
        <span class="error-emoji">🌙</span>
        <span class="error-number">4</span>
      </div>

      <!-- 错误提示 -->
      <h1 class="error-title">页面走丢了</h1>
      <p class="error-desc">你访问的页面可能已被移除、更名或暂时不可用</p>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <router-link to="/" class="action-btn primary">
          <IconSvg name="home" :size="16" />
          返回首页
        </router-link>
        <button class="action-btn secondary" @click="goBack">
          <IconSvg name="arrow-up" :size="16" />
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import IconSvg from '../components/IconSvg.vue'

const router = useRouter()

// 返回上一页
function goBack() {
  router.back()
}
</script>

<style scoped>
/* 404 页面容器 */
.not-found-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

/* 内容区域 */
.not-found-content {
  text-align: center;
  max-width: 500px;
}

/* 404 数字图标 */
.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.error-number {
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.error-emoji {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 错误标题 */
.error-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
}

/* 错误描述 */
.error-desc {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

/* 操作按钮容器 */
.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 按钮样式 */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 主要按钮 */
.action-btn.primary {
  background: var(--color-primary);
  color: #fff;
  border: 1px solid var(--color-primary);
}

.action-btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 141, 239, 0.3);
}

/* 次要按钮 */
.action-btn.secondary {
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .error-number {
    font-size: 4rem;
  }

  .error-emoji {
    font-size: 3rem;
  }

  .error-title {
    font-size: 1.4rem;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
