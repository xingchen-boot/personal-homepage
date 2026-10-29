/**
 * 暗色背景是否启用 WebGL 星空
 * - localStorage 持久化用户偏好
 * - 检测 WebGL / reduced-motion / 省电等，决定能否真正启用
 */
import { computed, ref } from 'vue'

const STORAGE_KEY = 'starlight-webgl-bg'

/** 用户是否希望开启 WebGL（默认开） */
const preferWebGL = ref(localStorage.getItem(STORAGE_KEY) !== 'false')

/**
 * 设备与系统是否适合跑 WebGL 背景
 */
function canUseWebGL() {
  if (typeof window === 'undefined') return false

  // 无障碍：减少动态效果时强制降级
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  // 省电模式（部分浏览器支持）
  if (navigator.connection?.saveData) {
    return false
  }

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

const webglCapable = ref(typeof window !== 'undefined' ? canUseWebGL() : false)

/** 最终是否使用 WebGL 星空 */
const useWebGLStars = computed(() => preferWebGL.value && webglCapable.value)

function setPreferWebGL(enabled) {
  preferWebGL.value = enabled
  localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
}

function togglePreferWebGL() {
  setPreferWebGL(!preferWebGL.value)
}

export function useWebGLBackground() {
  // 每次进入时再检测一次（系统设置可能变化）
  if (typeof window !== 'undefined') {
    webglCapable.value = canUseWebGL()
  }

  return {
    preferWebGL,
    webglCapable,
    useWebGLStars,
    setPreferWebGL,
    togglePreferWebGL,
  }
}
