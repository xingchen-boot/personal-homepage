<template>
  <button
    type="button"
    class="local-note-link"
    :class="{ ghost }"
    :title="hint"
    @click="onCopy"
  >
    <span class="label">{{ label }}</span>
    <span class="hint">{{ copied ? '已复制本机地址' : '仅本机' }}</span>
  </button>
</template>

<script setup>
/**
 * 本机笔记入口：不直接跳死链，点击复制 127.0.0.1 地址并提示「仅本机」
 */
import { ref } from 'vue'
import { copyLocalUrl } from '../utils/localLink'

const props = defineProps({
  url: { type: String, required: true },
  label: { type: String, default: '本机笔记' },
  ghost: { type: Boolean, default: false },
})

const copied = ref(false)
const hint = '笔记站仅本机可访问（需 127.0.0.1:4321）；点击复制地址'

async function onCopy() {
  const ok = await copyLocalUrl(props.url)
  if (!ok) return
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<style scoped>
.local-note-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: var(--color-primary);
}

.local-note-link.ghost {
  color: var(--color-text-secondary);
}

.local-note-link:hover .label {
  text-decoration: underline;
}

.label {
  font-size: 0.78rem;
  font-weight: 600;
}

.hint {
  font-size: 0.68rem;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
</style>
