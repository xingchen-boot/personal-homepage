<template>
  <div class="toc">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-list">
      <a
        v-for="heading in headings"
        :key="heading.text"
        :href="`#${heading.text}`"
        class="toc-item"
        :class="`toc-level-${heading.level}`"
      >
        {{ heading.text }}
      </a>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const headings = computed(() => {
  const matches = props.content.match(/^#{2,3} (.+)$/gm) || []
  return matches.map((match) => {
    const level = match.startsWith('### ') ? 3 : 2
    const text = match.replace(/^#{2,3} /, '')
    return { level, text }
  })
})
</script>

<style scoped>
.toc {
  padding: 16px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.toc-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-item {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: block;
}

.toc-item:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.toc-level-3 {
  padding-left: 20px;
  font-size: 0.75rem;
}
</style>
