import { ref, onMounted } from 'vue'

const THEME_KEY = 'starlight-theme'

// 提升到模块级别，所有组件共享同一份状态
const theme = ref('light')
const isAuto = ref(true)

function getAutoTheme() {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

function applyTheme(newTheme) {
  theme.value = newTheme
  document.documentElement.setAttribute('data-theme', newTheme)
}

function toggleTheme() {
  isAuto.value = false
  const newTheme = theme.value === 'light' ? 'dark' : 'light'
  applyTheme(newTheme)
  localStorage.setItem(THEME_KEY, newTheme)
  localStorage.setItem(`${THEME_KEY}-auto`, 'false')
}

function setAutoMode() {
  isAuto.value = true
  localStorage.removeItem(THEME_KEY)
  localStorage.setItem(`${THEME_KEY}-auto`, 'true')
  applyTheme(getAutoTheme())
}

// 初始化只执行一次
let initialized = false

function initTheme() {
  if (initialized) return
  initialized = true

  const savedAuto = localStorage.getItem(`${THEME_KEY}-auto`)
  const savedTheme = localStorage.getItem(THEME_KEY)

  if (savedAuto === 'false' && savedTheme) {
    isAuto.value = false
    applyTheme(savedTheme)
  } else {
    isAuto.value = true
    applyTheme(getAutoTheme())
  }
}

export function useTheme() {
  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    isAuto,
    toggleTheme,
    setAutoMode,
  }
}
