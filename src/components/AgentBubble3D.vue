<template>
  <!--
    球体：摸头 / 戳脸 / 戳肚 + 拖动 + 视线跟随
    「问我」标签：才打开正式问答面板
  -->
  <div
    ref="wrapRef"
    class="bubble-wrap"
    :class="{ open, talking, hovered, dragging, reacting: Boolean(mood), [`mood-${mood}`]: mood }"
  >
    <transition name="speech">
      <div v-if="speech" class="speech-pop" role="status">{{ speech }}</div>
    </transition>

    <div
      class="bubble-stage"
      role="button"
      tabindex="0"
      :title="bubbleTitle"
      :aria-label="bubbleTitle"
      @pointerdown="onPointerDown"
      @pointermove="onPointerDrag"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
      @keydown.enter.prevent="onKeyboardInteract"
      @keydown.space.prevent="onKeyboardInteract"
    >
      <span class="bubble-halo" aria-hidden="true" />
      <div v-if="use3D" ref="hostRef" class="bubble-host" aria-hidden="true"></div>
      <div v-else class="bubble-fallback" aria-hidden="true">
        <span class="fb-blush left" />
        <span class="fb-blush right" />
        <span class="fb-eye left" :class="{ shut: mood === 'pet' }" :style="fallbackEyeStyle">
          <i class="fb-pupil" />
          <i class="fb-shine" />
        </span>
        <span class="fb-eye right" :class="{ shut: mood === 'pet' }" :style="fallbackEyeStyle">
          <i class="fb-pupil" />
          <i class="fb-shine" />
        </span>
        <span class="fb-mouth" :class="{ talking: talking || mood }" />
      </div>
    </div>

    <button
      type="button"
      class="bubble-label"
      :title="title"
      :aria-expanded="open"
      @click.stop="$emit('toggle')"
    >
      {{ open ? '收起' : '问我' }}
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { pickBubbleLine } from '../data/agentBubbleLines'

const props = defineProps({
  open: { type: Boolean, default: false },
  talking: { type: Boolean, default: false },
  title: { type: String, default: '打开问答' },
})

const emit = defineEmits(['toggle', 'dragstart', 'drag', 'dragend'])

const wrapRef = ref(null)
const hostRef = ref(null)
const hovered = ref(false)
const dragging = ref(false)
/** @type {import('vue').Ref<'pet'|'face'|'belly'|''>} */
const mood = ref('')
const speech = ref('')
/** 相对气泡中心的视线方向：x/y ∈ [-1, 1] */
const look = ref({ x: 0, y: 0 })

const bubbleTitle = '点我互动 · 拖动可移动'

const DRAG_THRESHOLD = 6
/** @type {{ id: number, x: number, y: number } | null} */
let activePointer = null
let dragArmed = false
let lastLineIndex = -1
/** @type {ReturnType<typeof setTimeout> | null} */
let speechTimer = null
/** 互动表情持续到该时间戳（ms） */
let moodUntil = 0

/** 是否启用 3D（与站点其它 WebGL 降级策略一致） */
function detect3D() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (navigator.connection?.saveData) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

const use3D = ref(detect3D())

/** CSS 降级版：瞳孔按相对方向偏移（上下略弱于左右） */
const fallbackEyeStyle = computed(() => {
  if (mood.value === 'pet') return { transform: 'scaleY(0.12)' }
  const dx = look.value.x * 5.5
  const dy = look.value.y * 3.8
  return { transform: `translate(${dx}px, ${dy}px)` }
})

/** @type {null | (() => void)} */
let disposeScene = null

/**
 * 根据鼠标相对「球体」中心的位置更新视线
 */
function onPointerMove(event) {
  const el = wrapRef.value
  if (!el) return
  const stage = el.querySelector('.bubble-stage') || el
  const rect = stage.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const rangeX = Math.max(rect.width * 0.55, 48)
  const rangeY = Math.max(rect.height * 0.75, 64)
  const nx = Math.max(-1, Math.min(1, (event.clientX - cx) / rangeX))
  const ny = Math.max(-1, Math.min(1, (event.clientY - cy) / rangeY))
  look.value = { x: nx, y: ny }
  el.dataset.lookX = nx.toFixed(2)
  el.dataset.lookY = ny.toFixed(2)
}

/** 按下球体：准备拖动或点击互动（不打开问答） */
function onPointerDown(event) {
  if (event.button !== 0 && event.pointerType === 'mouse') return
  activePointer = { id: event.pointerId, x: event.clientX, y: event.clientY }
  dragArmed = false
  dragging.value = false
  event.currentTarget.setPointerCapture(event.pointerId)
}

function onPointerDrag(event) {
  if (!activePointer || event.pointerId !== activePointer.id) return
  const dx = event.clientX - activePointer.x
  const dy = event.clientY - activePointer.y
  if (!dragArmed && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
    dragArmed = true
    dragging.value = true
    emit('dragstart', { clientX: event.clientX, clientY: event.clientY })
  }
  if (dragArmed) {
    emit('drag', { clientX: event.clientX, clientY: event.clientY })
  }
}

/** 松手：拖动结束，或按点击位置触发摸头/戳脸/戳肚 */
function onPointerUp(event) {
  if (!activePointer || event.pointerId !== activePointer.id) return
  const wasDragging = dragArmed
  const x = event.clientX
  const y = event.clientY
  try {
    event.currentTarget.releasePointerCapture(event.pointerId)
  } catch {
    /* 已释放则忽略 */
  }
  activePointer = null
  dragArmed = false
  dragging.value = false
  if (wasDragging) {
    emit('dragend')
  } else {
    triggerInteract(x, y)
  }
}

function onKeyboardInteract() {
  const stage = wrapRef.value?.querySelector('.bubble-stage')
  if (!stage) return
  const rect = stage.getBoundingClientRect()
  triggerInteract(rect.left + rect.width / 2, rect.top + rect.height * 0.28)
}

/**
 * 按球体上的点击高度分流互动，并弹出相关台词
 * @param {number} clientX
 * @param {number} clientY
 */
function triggerInteract(clientX, clientY) {
  const stage = wrapRef.value?.querySelector('.bubble-stage')
  if (!stage) return
  const rect = stage.getBoundingClientRect()
  const relY = (clientY - rect.top) / Math.max(rect.height, 1)
  /** @type {'pet'|'face'|'belly'} */
  let kind = 'face'
  if (relY < 0.36) kind = 'pet'
  else if (relY > 0.7) kind = 'belly'

  const picked = pickBubbleLine(kind, lastLineIndex)
  lastLineIndex = picked.index
  mood.value = kind
  speech.value = picked.text
  moodUntil = performance.now() + 2600
  if (speechTimer) clearTimeout(speechTimer)
  speechTimer = setTimeout(() => {
    speech.value = ''
    mood.value = ''
    moodUntil = 0
  }, 2600)
}

/**
 * 初始化 Three.js 气泡：玻璃球 + 腮红 + 彩色虹膜 + 眨眼 + 嘴型
 */
async function setupBubble(host) {
  const THREE = await import('three')

  const size = 96
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(size, size)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20)
  camera.position.z = 3.55

  const root = new THREE.Group()
  scene.add(root)

  // —— 外层玻璃球 ——
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xb8d4ff,
    roughness: 0.12,
    metalness: 0.05,
    transparent: true,
    opacity: 0.55,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    sheen: 0.6,
    sheenColor: new THREE.Color(0xff9ec8),
    sheenRoughness: 0.4,
  })
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), bodyMat)
  root.add(body)

  // —— 内层渐变核（蓝→粉，品牌色） ——
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x7aa8f5,
      emissive: 0x3a5f9e,
      emissiveIntensity: 0.35,
      roughness: 0.55,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92,
    }),
  )
  root.add(core)

  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffb3d4,
      transparent: true,
      opacity: 0.45,
    }),
  )
  innerGlow.position.set(0.08, -0.12, 0.15)
  root.add(innerGlow)

  // —— 顶部高光弧 ——
  const gloss = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    }),
  )
  gloss.position.set(-0.32, 0.48, 0.72)
  gloss.scale.set(1.4, 0.55, 0.35)
  root.add(gloss)

  // —— 腮红 ——
  function makeBlush(x) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xff8ab8,
        transparent: true,
        opacity: 0.42,
      }),
    )
    mesh.position.set(x, -0.22, 0.82)
    mesh.scale.set(1.35, 0.75, 0.4)
    return mesh
  }
  const blushL = makeBlush(-0.48)
  const blushR = makeBlush(0.48)
  root.add(blushL, blushR)

  // —— 眼睛（椭圆眼白 + 彩色虹膜 + 瞳孔 + 双高光；眨眼只压扁眼白，不用眼皮网格） ——
  function makeEye(x) {
    const group = new THREE.Group()
    group.position.set(x, 0.16, 0.88)

    const white = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 28, 28),
      new THREE.MeshStandardMaterial({
        color: 0xfffaf8,
        roughness: 0.4,
        metalness: 0,
      }),
    )
    white.scale.set(1.08, 1.2, 0.72)

    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x3d6fd9,
        emissive: 0x1a3a7a,
        emissiveIntensity: 0.28,
        roughness: 0.35,
      }),
    )
    iris.position.z = 0.1

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.068, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0e1428, roughness: 0.2 }),
    )
    pupil.position.z = 0.17

    const shineBig = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    )
    shineBig.position.set(0.038, 0.048, 0.22)

    const shineSmall = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    )
    shineSmall.position.set(-0.032, -0.028, 0.22)

    group.add(white, iris, pupil, shineBig, shineSmall)
    return { group, white, iris, pupil, shineBig, shineSmall }
  }

  const leftEye = makeEye(-0.3)
  const rightEye = makeEye(0.3)
  root.add(leftEye.group, rightEye.group)

  // —— 微笑嘴 ——
  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.022, 10, 24, Math.PI),
    new THREE.MeshStandardMaterial({
      color: 0xe86a9a,
      roughness: 0.4,
      emissive: 0x5a2040,
      emissiveIntensity: 0.15,
    }),
  )
  mouth.position.set(0, -0.28, 0.9)
  mouth.rotation.set(Math.PI, 0, 0)
  mouth.scale.set(1, 0.7, 1)
  root.add(mouth)

  // —— 环绕微粒 ——
  const sparkles = []
  const sparkleGeo = new THREE.SphereGeometry(0.035, 8, 8)
  for (let i = 0; i < 6; i += 1) {
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xffffff : 0xffc0dc,
      transparent: true,
      opacity: 0.7,
    })
    const s = new THREE.Mesh(sparkleGeo, mat)
    const angle = (i / 6) * Math.PI * 2
    s.userData = { angle, radius: 1.25 + (i % 3) * 0.06, speed: 0.35 + i * 0.05 }
    sparkles.push(s)
    root.add(s)
  }

  // —— 灯光 ——
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35)
  keyLight.position.set(2.2, 3.2, 4)
  scene.add(keyLight)

  const fill = new THREE.DirectionalLight(0xffb8d8, 0.55)
  fill.position.set(-2.5, -1, 2)
  scene.add(fill)

  const rim = new THREE.PointLight(0x8eb6ff, 1.2, 8)
  rim.position.set(-1.5, 1.5, 2)
  scene.add(rim)

  scene.add(new THREE.AmbientLight(0xffffff, 0.45))

  const innerLight = new THREE.PointLight(0xff9ec8, 0.8, 3)
  innerLight.position.set(0, 0, 0.2)
  root.add(innerLight)

  let running = true
  const clock = new THREE.Clock()
  let frameId = 0
  const targetLook = new THREE.Vector2(0, 0)
  const smoothLook = new THREE.Vector2(0, 0)

  // 眨眼状态机
  let blinkUntil = 0
  let nextBlinkAt = 1.8 + Math.random() * 2.5
  let idleWander = new THREE.Vector2(0, 0)
  let nextWanderAt = 0
  let lastPointerAt = performance.now()
  let prevLook = { x: 0, y: 0 }

  function onVisibility() {
    running = document.visibilityState === 'visible'
  }
  document.addEventListener('visibilitychange', onVisibility)

  /** 眨眼：只压扁眼白/虹膜，结束后必须复位，避免「蓝眉毛」卡住 */
  function setBlink(amount) {
    const openY = 1.2 - amount * 1.12
    ;[leftEye, rightEye].forEach((eye) => {
      eye.white.scale.y = Math.max(0.08, openY)
      eye.iris.visible = amount < 0.7
      eye.pupil.visible = amount < 0.7
      eye.shineBig.visible = amount < 0.45
      eye.shineSmall.visible = amount < 0.45
      const hide = Math.max(0, 1 - amount * 1.2)
      eye.iris.scale.setScalar(hide)
      eye.pupil.scale.setScalar(hide)
    })
  }

  function resetEyesOpen() {
    const wide = hovered.value ? 1.28 : 1.2
    ;[leftEye, rightEye].forEach((eye) => {
      eye.white.scale.set(1.08, wide, 0.72)
      eye.iris.visible = true
      eye.pupil.visible = true
      eye.shineBig.visible = true
      eye.shineSmall.visible = true
      eye.iris.scale.setScalar(1)
      eye.pupil.scale.setScalar(1)
    })
  }

  let wasBlinking = false

  function animate() {
    frameId = requestAnimationFrame(animate)
    if (!running) return

    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime

    // 相对视线是否在变（拖动气泡时中心会变，也算在看）
    if (
      Math.abs(look.value.x - prevLook.x) > 0.01
      || Math.abs(look.value.y - prevLook.y) > 0.01
    ) {
      lastPointerAt = performance.now()
      prevLook = { ...look.value }
    }
    const idle = performance.now() - lastPointerAt > 2200

    const moodActive = performance.now() < moodUntil
    const currentMood = moodActive ? mood.value : ''

    // 呼吸 + 漂浮 + 互动变形
    const breathe = 1 + Math.sin(t * 1.8) * 0.028
    const floatY = Math.sin(t * 1.6) * 0.045
    const talkBoost = props.talking ? 1 + Math.sin(t * 12) * 0.04 : 1
    const hoverBoost = hovered.value ? 1.1 : 1
    const openBoost = props.open ? 1.04 : 1
    let sx = breathe * talkBoost * hoverBoost * openBoost
    let sy = sx
    let sz = sx
    if (currentMood === 'pet') {
      sy *= 1.06 + Math.sin(t * 14) * 0.03
      root.position.y = floatY + 0.06 + Math.abs(Math.sin(t * 10)) * 0.04
    } else if (currentMood === 'face') {
      sx *= 1.08
      sy *= 0.9
      root.position.y = floatY
    } else if (currentMood === 'belly') {
      sx *= 0.94 + Math.sin(t * 18) * 0.04
      sy *= 1.08
      root.position.y = floatY - 0.02
    } else {
      root.position.y = floatY
    }
    root.scale.set(sx, sy, sz)

    // 视线：朝向鼠标相对气泡的一侧；空闲时偶尔四处张望
    if (idle && !currentMood) {
      if (t > nextWanderAt) {
        idleWander.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 0.9)
        nextWanderAt = t + 1.2 + Math.random() * 2.2
      }
      targetLook.copy(idleWander)
    } else {
      targetLook.set(look.value.x, -look.value.y)
    }
    smoothLook.lerp(targetLook, 1 - Math.exp(-12 * dt))

    const maxX = hovered.value ? 0.13 : 0.11
    const maxY = hovered.value ? 0.08 : 0.065
    const px = THREE.MathUtils.clamp(smoothLook.x * maxX, -maxX, maxX)
    const py = THREE.MathUtils.clamp(smoothLook.y * maxY, -maxY, maxY)
    ;[leftEye, rightEye].forEach((eye) => {
      eye.iris.position.x = px
      eye.iris.position.y = py
      eye.pupil.position.x = px
      eye.pupil.position.y = py
      eye.shineBig.position.x = px + 0.038
      eye.shineBig.position.y = py + 0.048
      eye.shineSmall.position.x = px - 0.032
      eye.shineSmall.position.y = py - 0.028
    })

    // 眨眼 / 摸头闭眼笑
    if (currentMood === 'pet') {
      setBlink(0.88)
      wasBlinking = false
    } else {
      if (t >= nextBlinkAt && t >= blinkUntil) {
        blinkUntil = t + 0.14
        nextBlinkAt = t + 2.4 + Math.random() * 3.5
        wasBlinking = true
      }
      if (t < blinkUntil) {
        const phase = 1 - Math.abs(((blinkUntil - t) / 0.14) * 2 - 1)
        setBlink(phase)
      } else if (wasBlinking) {
        resetEyesOpen()
        wasBlinking = false
      } else {
        resetEyesOpen()
      }
    }

    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, smoothLook.x * 0.45, 0.12)
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, smoothLook.y * 0.16, 0.12)
    if (currentMood === 'belly') {
      root.rotation.z = Math.sin(t * 16) * 0.12
    } else if (currentMood === 'face') {
      root.rotation.z = Math.sin(t * 10) * 0.06
    } else if (props.open) {
      root.rotation.z = Math.sin(t * 2.4) * 0.05
    } else {
      root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, 0, 0.1)
    }

    // 说话 / 互动时嘴与腮红
    if (props.talking || currentMood) {
      const speed = currentMood === 'belly' ? 18 : 14
      const openAmt = 0.55 + Math.abs(Math.sin(t * speed)) * 0.7
      mouth.scale.set(currentMood === 'pet' ? 1.15 : 1.05, openAmt, 1)
      blushL.material.opacity = currentMood === 'face' ? 0.7 : 0.55
      blushR.material.opacity = currentMood === 'face' ? 0.7 : 0.55
      core.material.emissiveIntensity = 0.55
    } else {
      mouth.scale.set(1, props.open ? 0.85 : 0.7, 1)
      blushL.material.opacity = hovered.value ? 0.5 : 0.38
      blushR.material.opacity = hovered.value ? 0.5 : 0.38
      core.material.emissiveIntensity = 0.35 + Math.sin(t * 2) * 0.06
    }

    // 微粒环绕
    sparkles.forEach((s, i) => {
      const { angle, radius, speed } = s.userData
      const a = angle + t * speed
      s.position.set(
        Math.cos(a) * radius,
        Math.sin(a * 1.3 + i) * 0.35 + Math.sin(t + i) * 0.08,
        Math.sin(a) * radius * 0.55,
      )
      s.material.opacity = 0.35 + Math.sin(t * 3 + i) * 0.25
      const sc = 0.7 + Math.sin(t * 4 + i) * 0.35
      s.scale.setScalar(sc)
    })

    // 内光呼吸
    innerGlow.material.opacity = 0.35 + Math.sin(t * 2.2) * 0.12
    gloss.material.opacity = 0.45 + Math.sin(t * 1.5) * 0.1

    renderer.render(scene, camera)
  }

  animate()

  return () => {
    running = false
    cancelAnimationFrame(frameId)
    document.removeEventListener('visibilitychange', onVisibility)
    root.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
    sparkleGeo.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === host) {
      host.removeChild(renderer.domElement)
    }
  }
}

onMounted(async () => {
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  if (!use3D.value || !hostRef.value) return
  try {
    disposeScene = await setupBubble(hostRef.value)
  } catch (error) {
    console.warn('[AgentBubble3D] 初始化失败，降级 CSS：', error)
    use3D.value = false
    disposeScene = null
  }
})

watch(use3D, async (enabled) => {
  if (!enabled || disposeScene || !hostRef.value) return
  try {
    disposeScene = await setupBubble(hostRef.value)
  } catch {
    use3D.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  if (speechTimer) clearTimeout(speechTimer)
  if (disposeScene) disposeScene()
  disposeScene = null
})
</script>

<style scoped>
.bubble-wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.bubble-stage {
  position: relative;
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  cursor: grab;
  touch-action: none;
  border: none;
  background: transparent;
  padding: 0;
  outline: none;
}

.bubble-wrap.dragging .bubble-stage {
  cursor: grabbing;
}

.speech-pop {
  position: absolute;
  bottom: calc(100% - 4px);
  right: 0;
  z-index: 3;
  max-width: min(220px, 70vw);
  padding: 8px 12px;
  border-radius: 12px 12px 4px 12px;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--color-text);
  background: var(--color-bg-card);
  border: 1px solid color-mix(in srgb, var(--color-border) 65%, var(--color-primary));
  box-shadow: 0 8px 22px rgba(91, 141, 239, 0.18);
  pointer-events: none;
}

.bubble-wrap.panel-start .speech-pop,
.bubble-wrap.mood-pet .speech-pop {
  border-radius: 12px 12px 12px 4px;
}

.speech-enter-active,
.speech-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.speech-enter-from,
.speech-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}

.bubble-halo {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.55), transparent 42%),
    radial-gradient(circle at 50% 55%, rgba(91, 141, 239, 0.45), rgba(255, 126, 179, 0.28) 55%, transparent 72%);
  filter: blur(6px);
  opacity: 0.9;
  animation: halo-pulse 3.2s ease-in-out infinite;
  pointer-events: none;
}

.bubble-wrap.hovered .bubble-halo,
.bubble-wrap.open .bubble-halo,
.bubble-wrap.reacting .bubble-halo {
  opacity: 1;
  transform: scale(1.08);
  filter: blur(8px);
}

.bubble-wrap.talking .bubble-halo,
.bubble-wrap.reacting .bubble-halo {
  animation: halo-talk 0.7s ease-in-out infinite;
}

.bubble-host,
.bubble-fallback {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}

.bubble-host :deep(canvas) {
  display: block;
  width: 96px !important;
  height: 96px !important;
  border-radius: 50%;
  filter: drop-shadow(0 10px 22px rgba(91, 141, 239, 0.4));
}

/* —— CSS 降级表情球 —— */
.bubble-fallback {
  background:
    radial-gradient(circle at 32% 28%, #fff 0%, transparent 35%),
    radial-gradient(circle at 70% 70%, #ffb3d4 0%, transparent 45%),
    linear-gradient(145deg, #a8c8ff 0%, #7aa8f5 45%, #ff9ec8 100%);
  box-shadow:
    inset 0 -8px 18px rgba(255, 126, 179, 0.22),
    inset 0 8px 16px rgba(255, 255, 255, 0.35),
    0 10px 24px rgba(91, 141, 239, 0.38);
  overflow: hidden;
}

.fb-blush {
  position: absolute;
  top: 54%;
  width: 14px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 120, 170, 0.45);
  filter: blur(1px);
}

.fb-blush.left { left: 14px; }
.fb-blush.right { right: 14px; }

.fb-eye {
  position: absolute;
  top: 36%;
  width: 16px;
  height: 18px;
  border-radius: 50%;
  background: #fffaf8;
  box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.08);
  display: grid;
  place-items: center;
  transition: transform 0.1s linear;
  animation: fb-blink 4.5s ease-in-out infinite;
}

.fb-eye.left { left: 26px; }
.fb-eye.right { right: 26px; animation-delay: 0.08s; }

.fb-eye.shut {
  animation: none;
  transform: scaleY(0.12) !important;
}

.fb-pupil {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #5b8def, #1a2a55 70%);
  display: block;
  position: relative;
}

.fb-shine {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: -5px 4px 0 -1px rgba(255, 255, 255, 0.85);
}

.fb-mouth {
  position: absolute;
  left: 50%;
  bottom: 26px;
  width: 12px;
  height: 6px;
  margin-left: -6px;
  border: 2px solid #e86a9a;
  border-top: none;
  border-radius: 0 0 12px 12px;
  transition: height 0.15s ease, border-radius 0.15s ease;
}

.fb-mouth.talking {
  height: 9px;
  border-radius: 0 0 14px 14px;
  animation: mouth-talk 0.35s ease-in-out infinite;
}

.bubble-label {
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  padding: 3px 12px;
  border-radius: 999px;
  cursor: pointer;
  background: color-mix(in srgb, var(--color-bg-card) 88%, var(--color-primary));
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, var(--color-primary));
  color: var(--color-text-secondary);
  box-shadow: 0 4px 12px rgba(91, 141, 239, 0.12);
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.bubble-label:hover,
.bubble-wrap.open .bubble-label {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.bubble-wrap.talking .bubble-fallback,
.bubble-wrap.mood-pet .bubble-fallback {
  animation: bounce 0.55s ease-in-out infinite;
}

.bubble-wrap.mood-face .bubble-fallback {
  animation: squash 0.45s ease-in-out;
}

.bubble-wrap.mood-belly .bubble-fallback {
  animation: wiggle 0.45s ease-in-out infinite;
}

@keyframes halo-pulse {
  0%, 100% { opacity: 0.75; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes halo-talk {
  0%, 100% { opacity: 0.85; transform: scale(1.02); }
  50% { opacity: 1; transform: scale(1.14); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.04); }
}

@keyframes squash {
  0% { transform: scale(1, 1); }
  40% { transform: scale(1.08, 0.88); }
  100% { transform: scale(1, 1); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-6deg) scale(0.96, 1.04); }
  75% { transform: rotate(6deg) scale(0.96, 1.04); }
}

@keyframes fb-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.08); }
}

@keyframes mouth-talk {
  0%, 100% { height: 6px; }
  50% { height: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  .bubble-halo,
  .fb-eye,
  .fb-mouth.talking,
  .bubble-wrap.talking .bubble-fallback,
  .bubble-wrap.mood-pet .bubble-fallback,
  .bubble-wrap.mood-face .bubble-fallback,
  .bubble-wrap.mood-belly .bubble-fallback {
    animation: none;
  }
}
</style>
