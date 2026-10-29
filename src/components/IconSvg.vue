<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    class="icon-svg"
    :class="`icon-${name}`"
  >
    <defs>
      <!-- 白天渐变：樱花粉→蓝 -->
      <linearGradient id="grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :style="{ stopColor: 'var(--icon-grad-start)' }" />
        <stop offset="100%" :style="{ stopColor: 'var(--icon-grad-end)' }" />
      </linearGradient>
      <!-- 夜晚渐变：蓝→紫 -->
      <linearGradient id="grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :style="{ stopColor: 'var(--icon-grad-start)' }" />
        <stop offset="100%" :style="{ stopColor: 'var(--icon-grad-end)' }" />
      </linearGradient>
      <!-- 发光滤镜 -->
      <filter id="icon-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- ===== 首页 ===== -->
    <template v-if="name === 'home'">
      <!-- 屋顶 -->
      <path
        d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-3a1 1 0 0 1-1-1v-4.5a1.5 1.5 0 0 0-3 0V20.5a1 1 0 0 1-1 1h-3A1.5 1.5 0 0 1 3 20V10.5z"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 烟囱 -->
      <path d="M17 3v3.5" stroke="var(--icon-accent)" stroke-width="1.6" stroke-linecap="round" />
      <!-- 门上樱花装饰 -->
      <circle cx="12" cy="16" r="1.2" fill="var(--icon-accent)" opacity="0.7" />
      <!-- 小花瓣点缀 -->
      <circle cx="8.5" cy="13" r="0.5" fill="var(--icon-accent)" opacity="0.4" />
      <circle cx="15.5" cy="13" r="0.5" fill="var(--icon-accent)" opacity="0.4" />
    </template>

    <!-- ===== 文档/文章 ===== -->
    <template v-else-if="name === 'document'">
      <!-- 页面主体 -->
      <path
        d="M14 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V8L14 2z"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 折角 -->
      <path d="M14 2v6h5.5" stroke="var(--icon-grad-end)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      <!-- 文字行 -->
      <line x1="9" y1="13" x2="15" y2="13" stroke="var(--icon-primary)" stroke-width="1.4" stroke-linecap="round" />
      <line x1="9" y1="16.5" x2="13" y2="16.5" stroke="var(--icon-primary)" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />
      <!-- 樱花装饰 -->
      <circle cx="16.5" cy="16.5" r="1" fill="var(--icon-accent)" opacity="0.5" />
    </template>

    <!-- ===== 用户/关于 ===== -->
    <template v-else-if="name === 'user'">
      <!-- 头部 -->
      <circle
        cx="12" cy="8" r="4"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        fill="none"
      />
      <!-- 身体 -->
      <path
        d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        fill="none"
      />
      <!-- 头饰星光 -->
      <circle cx="15" cy="5.5" r="0.8" fill="var(--icon-accent)" opacity="0.6" />
      <circle cx="9.5" cy="5" r="0.5" fill="var(--icon-accent)" opacity="0.4" />
    </template>

    <!-- ===== 音乐 ===== -->
    <template v-else-if="name === 'music'">
      <!-- 音符主体 -->
      <path
        d="M9 18V6l10-2v12"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 左音符圆 -->
      <circle cx="6.5" cy="18" r="2.5" stroke="url(#grad-light)" stroke-width="1.6" fill="none" />
      <!-- 右音符圆 -->
      <circle cx="16.5" cy="16" r="2.5" stroke="url(#grad-light)" stroke-width="1.6" fill="none" />
      <!-- 音符装饰小星 -->
      <circle cx="13" cy="4" r="0.7" fill="var(--icon-accent)" opacity="0.5" />
      <circle cx="18" cy="5" r="0.5" fill="var(--icon-accent)" opacity="0.35" />
      <!-- 声波线 -->
      <path d="M20 8.5c1 0.5 2 1.5 2 3" stroke="var(--icon-accent)" stroke-width="1" stroke-linecap="round" opacity="0.4" />
    </template>

    <!-- ===== 日历 ===== -->
    <template v-else-if="name === 'calendar'">
      <!-- 日历外框 -->
      <rect
        x="3" y="4.5" width="18" height="17" rx="2.5"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        fill="none"
      />
      <!-- 顶部横条 -->
      <line x1="3" y1="9.5" x2="21" y2="9.5" stroke="var(--icon-grad-end)" stroke-width="1.4" />
      <!-- 挂耳 -->
      <line x1="8" y1="2.5" x2="8" y2="6" stroke="var(--icon-primary)" stroke-width="1.6" stroke-linecap="round" />
      <line x1="16" y1="2.5" x2="16" y2="6" stroke="var(--icon-primary)" stroke-width="1.6" stroke-linecap="round" />
      <!-- 日期点阵 -->
      <circle cx="8" cy="13" r="0.8" fill="var(--icon-primary)" opacity="0.3" />
      <circle cx="12" cy="13" r="0.8" fill="var(--icon-primary)" opacity="0.3" />
      <circle cx="16" cy="13" r="0.8" fill="var(--icon-primary)" opacity="0.3" />
      <circle cx="8" cy="17" r="0.8" fill="var(--icon-primary)" opacity="0.3" />
      <circle cx="12" cy="17" r="0.8" fill="var(--icon-accent)" opacity="0.7" />
      <circle cx="16" cy="17" r="0.8" fill="var(--icon-primary)" opacity="0.3" />
    </template>

    <!-- ===== 链接 ===== -->
    <template v-else-if="name === 'link'">
      <!-- 左链环 -->
      <path
        d="M10 13a4.5 4.5 0 0 0 6.36.36l2.5-2.5a4.5 4.5 0 0 0-6.36-6.36l-1.25 1.07"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        fill="none"
      />
      <!-- 右链环 -->
      <path
        d="M14 11a4.5 4.5 0 0 0-6.36-.36l-2.5 2.5a4.5 4.5 0 0 0 6.36 6.36l1.25-1.07"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        fill="none"
      />
      <!-- 中间装饰 -->
      <circle cx="12" cy="12" r="0.8" fill="var(--icon-accent)" opacity="0.5" />
    </template>

    <!-- ===== 归档/文件夹 ===== -->
    <template v-else-if="name === 'archive'">
      <path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2.2 2.8a1.5 1.5 0 0 0 1.2.6h7.6A2 2 0 0 1 22 8.4V19z"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 文件夹装饰线 -->
      <path d="M2 10h20" stroke="var(--icon-grad-end)" stroke-width="1" opacity="0.3" />
      <!-- 星形装饰 -->
      <circle cx="16" cy="15" r="1" fill="var(--icon-accent)" opacity="0.5" />
    </template>

    <!-- ===== 标签 ===== -->
    <template v-else-if="name === 'tag'">
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 标签孔 -->
      <circle cx="6.5" cy="6.5" r="1.5" stroke="var(--icon-accent)" stroke-width="1.2" fill="none" opacity="0.7" />
      <circle cx="6.5" cy="6.5" r="0.5" fill="var(--icon-accent)" opacity="0.5" />
    </template>

    <!-- ===== GitHub ===== -->
    <template v-else-if="name === 'mail'">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </template>
    <template v-else-if="name === 'github'">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        stroke="var(--icon-primary)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 眼睛 -->
      <circle cx="9.5" cy="10" r="0.8" fill="var(--icon-accent)" opacity="0.6" />
      <circle cx="14.5" cy="10" r="0.8" fill="var(--icon-accent)" opacity="0.6" />
    </template>

    <!-- ===== 太阳 ===== -->
    <template v-else-if="name === 'sun'">
      <!-- 光晕 -->
      <circle cx="12" cy="12" r="6" fill="var(--icon-accent)" opacity="0.08" />
      <!-- 太阳主体 -->
      <circle cx="12" cy="12" r="4.5" stroke="url(#grad-light)" stroke-width="1.6" fill="none" />
      <!-- 光芒线 -->
      <line x1="12" y1="1.5" x2="12" y2="4" stroke="var(--icon-grad-start)" stroke-width="1.4" stroke-linecap="round" />
      <line x1="12" y1="20" x2="12" y2="22.5" stroke="var(--icon-grad-start)" stroke-width="1.4" stroke-linecap="round" />
      <line x1="1.5" y1="12" x2="4" y2="12" stroke="var(--icon-grad-start)" stroke-width="1.4" stroke-linecap="round" />
      <line x1="20" y1="12" x2="22.5" y2="12" stroke="var(--icon-grad-start)" stroke-width="1.4" stroke-linecap="round" />
      <!-- 斜光芒 -->
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" stroke="var(--icon-grad-end)" stroke-width="1.2" stroke-linecap="round" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" stroke="var(--icon-grad-end)" stroke-width="1.2" stroke-linecap="round" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" stroke="var(--icon-grad-end)" stroke-width="1.2" stroke-linecap="round" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" stroke="var(--icon-grad-end)" stroke-width="1.2" stroke-linecap="round" />
    </template>

    <!-- ===== 月亮 ===== -->
    <template v-else-if="name === 'moon'">
      <!-- 月牙 -->
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="url(#grad-light)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- 月内星星 -->
      <circle cx="10" cy="8" r="0.6" fill="var(--icon-accent)" opacity="0.6" />
      <circle cx="13" cy="5.5" r="0.4" fill="var(--icon-accent)" opacity="0.4" />
      <circle cx="8" cy="12" r="0.35" fill="var(--icon-accent)" opacity="0.3" />
    </template>

    <!-- ===== 时钟 ===== -->
    <template v-else-if="name === 'clock'">
      <!-- 外圈 -->
      <circle cx="12" cy="12" r="9.5" stroke="url(#grad-light)" stroke-width="1.6" fill="none" />
      <!-- 内圈装饰 -->
      <circle cx="12" cy="12" r="7" stroke="var(--icon-grad-end)" stroke-width="0.5" fill="none" opacity="0.2" />
      <!-- 时针 -->
      <line x1="12" y1="12" x2="12" y2="7" stroke="var(--icon-primary)" stroke-width="1.8" stroke-linecap="round" />
      <!-- 分针 -->
      <line x1="12" y1="12" x2="16" y2="14" stroke="var(--icon-grad-end)" stroke-width="1.4" stroke-linecap="round" />
      <!-- 中心点 -->
      <circle cx="12" cy="12" r="1" fill="var(--icon-accent)" />
      <!-- 刻度 -->
      <circle cx="12" cy="3.5" r="0.5" fill="var(--icon-primary)" opacity="0.5" />
      <circle cx="20.5" cy="12" r="0.5" fill="var(--icon-primary)" opacity="0.5" />
      <circle cx="12" cy="20.5" r="0.5" fill="var(--icon-primary)" opacity="0.5" />
      <circle cx="3.5" cy="12" r="0.5" fill="var(--icon-primary)" opacity="0.5" />
    </template>

    <!-- ===== 地球/语言 ===== -->
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9.5" stroke="url(#grad-light)" stroke-width="1.6" fill="none" />
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="var(--icon-grad-end)" stroke-width="1" fill="none" opacity="0.5" />
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="var(--icon-grad-end)" stroke-width="1" opacity="0.5" />
      <line x1="4.5" y1="6.5" x2="19.5" y2="6.5" stroke="var(--icon-grad-end)" stroke-width="0.8" opacity="0.3" />
      <line x1="4.5" y1="17.5" x2="19.5" y2="17.5" stroke="var(--icon-grad-end)" stroke-width="0.8" opacity="0.3" />
      <circle cx="12" cy="12" r="1" fill="var(--icon-accent)" opacity="0.5" />
    </template>

    <!-- ===== 搜索 ===== -->
    <template v-else-if="name === 'search'">
      <!-- 放大镜圆圈 -->
      <circle cx="10.5" cy="10.5" r="6.5" stroke="url(#grad-light)" stroke-width="1.6" fill="none" />
      <!-- 放大镜手柄 -->
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="url(#grad-light)" stroke-width="1.8" stroke-linecap="round" />
      <!-- 镜片反光 -->
      <circle cx="8.5" cy="8.5" r="1" fill="var(--icon-accent)" opacity="0.3" />
    </template>

    <!-- ===== 关闭 ===== -->
    <template v-else-if="name === 'close'">
      <!-- X 形状 -->
      <line x1="6" y1="6" x2="18" y2="18" stroke="url(#grad-light)" stroke-width="1.8" stroke-linecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" stroke="url(#grad-light)" stroke-width="1.8" stroke-linecap="round" />
    </template>

    <!-- ===== 上升箭头（回到顶部） ===== -->
    <template v-else-if="name === 'arrow-up'">
      <line x1="12" y1="19" x2="12" y2="5" stroke="url(#grad-light)" stroke-width="1.8" stroke-linecap="round" />
      <polyline points="5,12 12,5 19,12" stroke="url(#grad-light)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </template>

    <!-- ===== 星尘 / WebGL 背景开关 ===== -->
    <template v-else-if="name === 'sparkles'">
      <path
        d="M12 3l1.2 4.2L17.5 8.5l-4.3 1.3L12 14l-1.2-4.2L6.5 8.5l4.3-1.3L12 3z"
        fill="url(#grad-light)"
        opacity="0.95"
      />
      <circle cx="18.5" cy="6" r="1.2" fill="var(--icon-accent)" opacity="0.85" />
      <circle cx="5.5" cy="16.5" r="1" fill="var(--icon-accent)" opacity="0.7" />
      <circle cx="18" cy="17" r="0.8" fill="url(#grad-light)" opacity="0.8" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 18,
  },
})
</script>

<style scoped>
.icon-svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: filter 0.3s ease;
}

.icon-svg:hover {
  filter: drop-shadow(0 0 4px var(--icon-accent));
}
</style>
