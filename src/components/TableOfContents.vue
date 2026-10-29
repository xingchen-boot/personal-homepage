<template>
  <div class="toc" :class="{ collapsed: !expanded }">
    <button
      type="button"
      class="toc-toggle"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <h4 class="toc-title">目录</h4>
      <span class="toc-toggle-hint">{{ expanded ? '收起' : `展开 · ${headings.length}` }}</span>
    </button>
    <nav v-show="expanded" class="toc-list">
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
        <span v-if="heading.number" class="toc-number">{{ heading.number }}</span>{{ heading.text }}
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

/** 桌面默认展开；窄屏默认收起，避免占满首屏 */
const expanded = ref(true)

const alreadyNumbered = (text) =>
  /^(?:\d+[\.、．]|[一二三四五六七八九十百]+[、.．]|第[一二三四五六七八九十\d]+[章节篇]|模式\s*\d+)/.test(
    String(text).trim(),
  )

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
      return {
        level,
        text,
        number: alreadyNumbered(text) ? '' : `${h2Count}.`,
      }
    }
    h3Count++
    return {
      level,
      text,
      number: alreadyNumbered(text) ? '' : `${h2Count}.${h3Count}`,
    }
  })
})

const activeId = ref('')
let isScrolling = false
let scrollTimer = null
let mq = null

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

  // 窄屏点目录后收起，腾出阅读区
  if (mq && !mq.matches) expanded.value = false
}

let observer = null

function syncExpandedToViewport() {
  if (!mq) return
  expanded.value = mq.matches
}

onMounted(() => {
  mq = window.matchMedia('(min-width: 1025px)')
  syncExpandedToViewport()
  mq.addEventListener?.('change', syncExpandedToViewport)

  const ids = headings.value.map((h) => h.text)
  observer = new IntersectionObserver(
    (entries) => {
      if (isScrolling) return
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  )
  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  mq?.removeEventListener?.('change', syncExpandedToViewport)
  clearTimeout(scrollTimer)
})
</script>

<style scoped>
.toc {
  padding: 16px;
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.toc-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font: inherit;
}

.toc-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.toc-toggle-hint {
  flex-shrink: 0;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
}

.toc:not(.collapsed) .toc-toggle {
  margin-bottom: 12px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: min(60vh, 420px);
  overflow-y: auto;
}

.toc-item {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: block;
  cursor: pointer;
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

@media (min-width: 1025px) {
  .toc-toggle-hint {
    display: none;
  }

  .toc-toggle {
    pointer-events: none;
  }
}
</style>
