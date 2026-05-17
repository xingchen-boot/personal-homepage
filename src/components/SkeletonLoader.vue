<template>
  <!-- 骨架屏加载组件 - 用于数据加载时显示占位效果 -->
  <div class="skeleton-wrapper" :class="type">
    <!-- 文章卡片骨架屏 -->
    <template v-if="type === 'article-card'">
      <div class="skeleton-card">
        <div class="skeleton-image skeleton-animate"></div>
        <div class="skeleton-body">
          <div class="skeleton-title skeleton-animate"></div>
          <div class="skeleton-text skeleton-animate"></div>
          <div class="skeleton-text short skeleton-animate"></div>
          <div class="skeleton-meta">
            <div class="skeleton-badge skeleton-animate"></div>
            <div class="skeleton-badge skeleton-animate"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 文章详情骨架屏 -->
    <template v-else-if="type === 'article-detail'">
      <div class="skeleton-detail">
        <div class="skeleton-heading skeleton-animate"></div>
        <div class="skeleton-meta-row">
          <div class="skeleton-badge skeleton-animate"></div>
          <div class="skeleton-badge skeleton-animate"></div>
        </div>
        <div class="skeleton-line skeleton-animate"></div>
        <div class="skeleton-line skeleton-animate"></div>
        <div class="skeleton-line short skeleton-animate"></div>
        <div class="skeleton-space"></div>
        <div class="skeleton-line skeleton-animate"></div>
        <div class="skeleton-line skeleton-animate"></div>
        <div class="skeleton-line medium skeleton-animate"></div>
      </div>
    </template>

    <!-- 列表项骨架屏 -->
    <template v-else-if="type === 'list-item'">
      <div class="skeleton-list-item">
        <div class="skeleton-dot skeleton-animate"></div>
        <div class="skeleton-list-content">
          <div class="skeleton-text skeleton-animate"></div>
          <div class="skeleton-text short skeleton-animate"></div>
        </div>
      </div>
    </template>

    <!-- 通用骨架屏 -->
    <template v-else>
      <div class="skeleton-generic">
        <div class="skeleton-text skeleton-animate"></div>
        <div class="skeleton-text skeleton-animate"></div>
        <div class="skeleton-text short skeleton-animate"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
// 骨架屏类型：article-card | article-detail | list-item | generic
defineProps({
  type: {
    type: String,
    default: 'generic',
    validator: (value) => ['article-card', 'article-detail', 'list-item', 'generic'].includes(value)
  }
})
</script>

<style scoped>
/* 骨架屏容器 */
.skeleton-wrapper {
  width: 100%;
}

/* 闪烁动画 */
.skeleton-animate {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    var(--color-bg-card) 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 文章卡片骨架屏 */
.skeleton-card {
  display: flex;
  height: 200px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.skeleton-image {
  width: 300px;
  height: 100%;
  flex-shrink: 0;
}

.skeleton-body {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
}

.skeleton-text {
  height: 16px;
  width: 100%;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-meta {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.skeleton-badge {
  height: 20px;
  width: 60px;
  border-radius: 10px;
}

/* 文章详情骨架屏 */
.skeleton-detail {
  padding: 24px;
}

.skeleton-heading {
  height: 36px;
  width: 80%;
  margin-bottom: 16px;
}

.skeleton-meta-row {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.skeleton-line {
  height: 16px;
  width: 100%;
  margin-bottom: 12px;
}

.skeleton-line.short {
  width: 40%;
}

.skeleton-line.medium {
  width: 70%;
}

.skeleton-space {
  height: 24px;
}

/* 列表项骨架屏 */
.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 通用骨架屏 */
.skeleton-generic {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .skeleton-card {
    flex-direction: column;
    height: auto;
  }

  .skeleton-image {
    width: 100%;
    height: 180px;
  }
}
</style>
