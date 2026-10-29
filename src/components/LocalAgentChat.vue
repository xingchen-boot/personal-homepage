<template>
  <!-- 可拖动本地问答助手（无 API Key）；位置写入 localStorage -->
  <div
    class="agent-root"
    :class="{
      dragging,
      placed: Boolean(pos),
      'panel-start': panelStart,
      'panel-below': panelBelow,
    }"
    :style="rootStyle"
  >
    <!-- 对话面板 -->
    <transition name="agent-panel">
      <section
        v-if="open"
        class="agent-panel"
        role="dialog"
        aria-label="星辰助手"
      >
        <header class="agent-header">
          <div class="agent-identity">
            <div class="agent-avatar" :class="{ talking }">
              <span class="avatar-face">✦</span>
            </div>
            <div>
              <h3 class="agent-name">星辰助手</h3>
              <p class="agent-status">本地检索 · 无需 API Key</p>
            </div>
          </div>
          <button type="button" class="icon-btn" aria-label="关闭" @click="open = false">×</button>
        </header>

        <div ref="listRef" class="agent-messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="message.role"
          >
            <p class="message-text">{{ message.text }}</p>
            <div v-if="message.links?.length" class="message-links">
              <router-link
                v-for="link in message.links"
                :key="link.to"
                :to="link.to"
                class="message-link"
                @click="open = false"
              >
                {{ link.label }} →
              </router-link>
            </div>
          </div>
          <div v-if="talking" class="message assistant typing">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </div>
        </div>

        <!-- 跟当前路由相关的快捷入口 -->
        <div v-if="contextLinks.length" class="agent-context">
          <span class="context-label">当前页</span>
          <router-link
            v-for="link in contextLinks"
            :key="link.to + link.label"
            :to="link.to"
            class="context-chip"
            @click="open = false"
          >
            {{ link.label }}
          </router-link>
        </div>

        <div class="agent-suggestions">
          <button
            v-for="item in suggestions"
            :key="item"
            type="button"
            class="chip"
            :disabled="talking"
            @click="ask(item)"
          >
            {{ item }}
          </button>
        </div>

        <form class="agent-input-row" @submit.prevent="submit">
          <input
            v-model="draft"
            class="agent-input"
            type="text"
            maxlength="120"
            placeholder="问问我的实习、项目或技能…"
            :disabled="talking"
          />
          <button class="send-btn" type="submit" :disabled="talking || !draft.trim()">
            发送
          </button>
        </form>
      </section>
    </transition>

    <!-- 球体可摸头互动；仅「问我」打开面板 -->
    <AgentBubble3D
      :open="open"
      :talking="talking"
      :title="open ? '收起问答' : '打开星辰助手问答'"
      @toggle="toggle"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd"
    />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { agentSuggestedQuestions } from '../data/agentKnowledge'
import { projectList } from '../data/projects'
import { resumeArticles } from '../data/resumeArticles'
import { answerLocally } from '../composables/useLocalAgent'

/** 异步加载 3D 气泡，避免拖慢首屏 */
const AgentBubble3D = defineAsyncComponent(() => import('./AgentBubble3D.vue'))

const route = useRoute()
const POS_KEY = 'agent-bubble-pos'
const PAD = 8

const open = ref(false)
const talking = ref(false)
const draft = ref('')
const listRef = ref(null)

/** 当前文章对应的项目（若有 writeupId） */
const pageProject = computed(() => {
  if (route.name !== 'BlogDetail') return null
  const id = String(route.params.id || '')
  return projectList.find((p) => p.writeupId && String(p.writeupId) === id) || null
})

const pageArticle = computed(() => {
  if (route.name !== 'BlogDetail') return null
  const id = String(route.params.id || '')
  return resumeArticles.find((a) => a.id === id) || null
})

/** 面板顶部「当前页」跳转 */
const contextLinks = computed(() => {
  const links = []
  if (route.name === 'BlogDetail' && route.params.id) {
    if (pageProject.value) {
      links.push({ to: '/projects', label: `项目 · ${shortName(pageProject.value.name)}` })
    }
    links.push({ to: '/resume', label: '简历相关段' })
  } else if (route.name === 'Projects') {
    links.push({ to: '/resume', label: '简历 · 项目' })
    links.push({ to: '/', label: '首页精选' })
  } else if (route.name === 'Resume') {
    links.push({ to: '/projects', label: '作品集' })
    links.push({ to: '/about', label: '关于' })
  }
  return links
})

/** 按页面调整快捷问 */
const suggestions = computed(() => {
  if (route.name === 'BlogDetail') {
    return ['这篇讲了什么？', '对应哪个项目？', '腾讯实习做什么？', '有哪些项目？']
  }
  if (route.name === 'Resume') {
    return ['你是谁？', '腾讯实习做什么？', '有哪些项目？', '怎么联系你？']
  }
  return agentSuggestedQuestions
})

function shortName(name) {
  const raw = String(name || '')
  return raw.length > 14 ? `${raw.slice(0, 14)}…` : raw
}

/** @type {import('vue').Ref<{ left: number, top: number } | null>} */
const pos = ref(null)
const dragging = ref(false)
/** 拖动时指针相对 agent-root 左上角的偏移 */
let grabOffset = { x: 0, y: 0 }
/** 拖动开始时的根节点尺寸，用于钳制 */
let rootSize = { w: 120, h: 120 }

const rootStyle = computed(() => {
  if (!pos.value) return undefined
  return {
    left: `${pos.value.left}px`,
    top: `${pos.value.top}px`,
    right: 'auto',
    bottom: 'auto',
  }
})

/** 靠左时面板左对齐，避免溢出屏幕 */
const panelStart = computed(() => {
  if (!pos.value || typeof window === 'undefined') return false
  return pos.value.left < window.innerWidth * 0.42
})

/** 靠顶时面板改到气泡下方 */
const panelBelow = computed(() => {
  if (!pos.value) return false
  return pos.value.top < 100
})

/** 把位置限制在可视区域内 */
function clampPos(left, top, width = rootSize.w, height = rootSize.h) {
  const maxL = Math.max(PAD, window.innerWidth - width - PAD)
  const maxT = Math.max(PAD, window.innerHeight - height - PAD)
  return {
    left: Math.min(Math.max(PAD, left), maxL),
    top: Math.min(Math.max(PAD, top), maxT),
  }
}

function onDragStart(payload) {
  const el = document.querySelector('.agent-root')
  if (!el) return
  const rect = el.getBoundingClientRect()
  dragging.value = true
  rootSize = { w: rect.width, h: rect.height }
  grabOffset = {
    x: payload.clientX - rect.left,
    y: payload.clientY - rect.top,
  }
  // 从默认 right/bottom 切到 left/top 坐标
  if (!pos.value) {
    pos.value = clampPos(rect.left, rect.top, rect.width, rect.height)
  }
}

function onDrag(payload) {
  if (!dragging.value) return
  pos.value = clampPos(
    payload.clientX - grabOffset.x,
    payload.clientY - grabOffset.y,
  )
}

function onDragEnd() {
  dragging.value = false
  if (!pos.value) return
  try {
    localStorage.setItem(POS_KEY, JSON.stringify(pos.value))
  } catch {
    /* 隐私模式等忽略 */
  }
}

function restorePos() {
  try {
    const raw = localStorage.getItem(POS_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (typeof parsed?.left === 'number' && typeof parsed?.top === 'number') {
      pos.value = clampPos(parsed.left, parsed.top, 120, 140)
    }
  } catch {
    pos.value = null
  }
}

function onResize() {
  if (!pos.value) return
  const el = document.querySelector('.agent-root')
  const w = el?.getBoundingClientRect().width || 120
  const h = el?.getBoundingClientRect().height || 140
  pos.value = clampPos(pos.value.left, pos.value.top, w, h)
}

onMounted(() => {
  restorePos()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

/** @type {import('vue').Ref<Array<{id:number, role:string, text:string, links?: Array<{to:string,label:string}>}>>} */
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: '你好，我是星辰的本地助手。我可以基于站内公开资料回答实习、项目、技能和联系方式等问题（不联网、不用 API Key）。',
    links: [
      { to: '/resume', label: '查看简历' },
      { to: '/projects', label: '项目作品集' },
    ],
  },
])

let messageId = 2

function toggle() {
  open.value = !open.value
}

async function scrollToBottom() {
  await nextTick()
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
}

/**
 * 提问并生成本地回答（带短延迟模拟「思考」动画）
 * @param {string} question
 */
async function ask(question) {
  const text = String(question || '').trim()
  if (!text || talking.value) return

  messages.value.push({ id: messageId++, role: 'user', text })
  draft.value = ''
  talking.value = true
  await scrollToBottom()

  // 轻微「思考中」节奏，纯本地检索其实很快
  await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 350))

  const contextual = answerForCurrentPage(text)
  const result = contextual || answerLocally(text)
  const links = (result.matches || [])
    .filter((item) => item.link)
    .slice(0, 2)
    .map((item) => ({ to: item.link, label: item.linkLabel || item.title }))

  messages.value.push({
    id: messageId++,
    role: 'assistant',
    text: result.answer,
    links,
  })
  talking.value = false
  await scrollToBottom()
}

/**
 * 文章页上下文问答：本篇摘要 / 对应项目
 * @returns {{ answer: string, matches: Array<{link:string,linkLabel?:string,title?:string}> } | null}
 */
function answerForCurrentPage(text) {
  if (route.name !== 'BlogDetail') return null
  const id = String(route.params.id || '')
  const article = pageArticle.value
  const project = pageProject.value
  const title =
    article?.title ||
    document.querySelector('.article-title')?.textContent?.trim() ||
    '当前文章'

  if (/这篇|本篇|当前(这篇|文章)?|讲了什么|在讲什么/.test(text)) {
    const summary = article?.summary || '这是一篇站内技术复盘，可结合目录与自检小节阅读。'
    return {
      answer: `你正在阅读《${title}》。\n\n${summary}`,
      matches: [
        { link: `/blog/${id}`, linkLabel: '留在本篇', title },
        project
          ? { link: '/projects', linkLabel: '对应项目', title: project.name }
          : { link: '/resume', linkLabel: '简历', title: '简历' },
      ].filter(Boolean),
    }
  }

  if (/对应.*项目|哪个项目|相关项目/.test(text)) {
    if (project) {
      return {
        answer: `《${title}》对应项目是「${project.name}」。\n\n问题：${project.problem || '—'}\n结果：${project.result || project.metric || '—'}`,
        matches: [
          { link: '/projects', linkLabel: '打开作品集', title: project.name },
          { link: '/resume', linkLabel: '简历相关', title: '简历' },
        ],
      }
    }
    return {
      answer: `《${title}》暂未绑定作品集条目，可先看简历或项目页里的相近专项。`,
      matches: [
        { link: '/projects', linkLabel: '项目作品集' },
        { link: '/resume', linkLabel: '个人简历' },
      ],
    }
  }

  return null
}

function submit() {
  ask(draft.value)
}
</script>

<style scoped>
.agent-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* 根节点只包住气泡，面板绝对定位叠在上方，拖动时气泡不会被顶跑 */
}

.agent-root.dragging {
  user-select: none;
}

.agent-panel {
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  width: min(360px, calc(100vw - 28px));
  max-height: min(560px, calc(100vh - 120px));
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-lg, 0 16px 40px rgba(0, 0, 0, 0.16));
}

.agent-root.panel-start .agent-panel {
  right: auto;
  left: 0;
}

.agent-root.panel-below .agent-panel {
  bottom: auto;
  top: calc(100% + 12px);
}

.agent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}

.agent-identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light, #f7d6e6));
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease;
}

.agent-avatar.talking {
  animation: avatar-talk 0.8s ease-in-out infinite;
}

.avatar-face {
  color: var(--color-primary);
  font-size: 0.95rem;
}

.agent-name {
  font-size: 0.92rem;
  margin: 0;
  color: var(--color-text);
}

.agent-status {
  margin: 2px 0 0;
  font-size: 0.72rem;
  color: var(--color-text-muted, var(--color-text-secondary));
}

.icon-btn {
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}

.agent-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: color-mix(in srgb, var(--color-bg) 65%, transparent);
}

.message {
  max-width: 92%;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.84rem;
  line-height: 1.65;
  white-space: pre-wrap;
}

.message.user {
  align-self: flex-end;
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  align-self: flex-start;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-bottom-left-radius: 4px;
}

.message-text {
  margin: 0;
}

.message-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.message-link {
  font-size: 0.78rem;
  color: var(--color-primary);
  text-decoration: none;
}

.message-link:hover {
  text-decoration: underline;
}

.message.typing {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 12px 14px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  animation: typing 1.1s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

.agent-context {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 0 12px 8px;
}

.context-label {
  font-size: 0.68rem;
  color: var(--color-text-secondary);
  margin-right: 2px;
}

.context-chip {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  background: var(--color-primary-light);
}

.context-chip:hover {
  text-decoration: underline;
}

.agent-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 12px 10px;
}

@media print {
  .agent-root {
    display: none !important;
  }
}

.chip {
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.72rem;
  cursor: pointer;
}

.chip:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.agent-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid var(--color-border);
}

.agent-input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 8px 10px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.85rem;
  outline: none;
}

.agent-input:focus {
  border-color: var(--color-primary);
}

.send-btn {
  border: none;
  border-radius: 10px;
  padding: 0 14px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.82rem;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.agent-panel-enter-active,
.agent-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.agent-panel-enter-from,
.agent-panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@keyframes avatar-talk {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

@keyframes typing {
  0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-2px); }
}

@media (max-width: 768px) {
  .agent-root {
    right: 14px;
    bottom: 14px;
  }

  /* 避免与回到顶部按钮重叠 */
  .agent-root {
    bottom: 72px;
  }
}
</style>
