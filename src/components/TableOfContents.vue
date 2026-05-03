<template>
  <div class="toc">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-list">
      <a
        v-for="heading in headings"
        :key="heading.text"
        class="toc-item"
        :class="[
          `toc-level-${heading.level}`,
          { active: activeId === heading.text }
        ]"
        @click.prevent="scrollTo(heading.text)"
      >
        <span class="toc-number">{{ heading.number }}</span>{{ heading.text }}
      </a>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const headings = computed(() => {
  const matches = props.content.match(/^#{2,3} (.+)$/gm) || []
  let h2Count = 0
  let h3Count = 0
  return matches.map((match) => {
    const level = match.startsWith('### ') ? 3 : 2
    const text = match.replace(/^#{2,3} /, '')
    if (level === 2) {
      h2Count++
      h3Count = 0
      return { level, text, number: `${h2Count}.` }
    } else {
      h3Count++
      return { level, text, number: `${h2Count}.${h3Count}` }
    }
  })
})

const activeId = ref('')
let isScrolling = false
let scrollTimer = null

function scrollTo(text) {
  const el = document.getElementById(text)
  if (!el) return

  isScrolling = true
  activeId.value = text
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })

  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    isScrolling = false
  }, 800)
}

let observer = null

onMounted(() => {
  const ids = headings.value.map(h => h.text)
  observer = new IntersectionObserver(
    (entries) => {
      if (isScrolling) return
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  )
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
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

.toc-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

.toc-level-3 {
  padding-left: 20px;
  font-size: 0.75rem;
}

.toc-number {
  color: var(--color-primary);
  font-weight: 500;
  margin-right: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 0.7em;
}
</style>
