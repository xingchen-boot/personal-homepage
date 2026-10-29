<template>
  <!-- Three.js 星空画布：仅暗色模式且用户允许 WebGL 时挂载 -->
  <div ref="hostRef" class="starfield-webgl" aria-hidden="true"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 顶层 await：配合外层 Suspense，three 未就绪时继续显示 2D 星空兜底
 * 同时让 three 进入独立异步 chunk，不打进首屏主包
 */
const THREE = await import('three')

const hostRef = ref(null)

/** @type {null | (() => void)} */
let disposeScene = null

/**
 * 初始化 Three.js 星空场景
 */
function setupStarfield(host) {
  const width = window.innerWidth
  const height = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  })
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.setClearColor(0x0a0a1a, 1)
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000)
  camera.position.z = 420

  // ---------- 星点粒子 ----------
  const starCount = Math.min(1800, Math.floor((width * height) / 900))
  const positions = new Float32Array(starCount * 3)
  const phases = new Float32Array(starCount)
  const sizes = new Float32Array(starCount)

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1400
    positions[i * 3 + 1] = (Math.random() - 0.5) * 900
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800
    phases[i] = Math.random() * Math.PI * 2
    sizes[i] = Math.random() * 2.2 + 0.6
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    },
    vertexShader: `
      attribute float aPhase;
      attribute float aSize;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      void main() {
        float twinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
        vAlpha = twinkle;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPixelRatio * (220.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, dist);
        gl_FragColor = vec4(0.85, 0.9, 1.0, vAlpha * glow);
      }
    `,
  })

  const stars = new THREE.Points(geometry, material)
  scene.add(stars)

  // ---------- 流星（短线段） ----------
  const shootingGeometry = new THREE.BufferGeometry()
  const shootingPositions = new Float32Array(6)
  shootingGeometry.setAttribute('position', new THREE.BufferAttribute(shootingPositions, 3))
  const shootingMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  })
  const shootingLine = new THREE.Line(shootingGeometry, shootingMaterial)
  scene.add(shootingLine)

  let shooting = {
    active: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    life: 0,
    timer: 0,
    next: 2 + Math.random() * 4,
  }

  function spawnShooting() {
    shooting.active = true
    shooting.x = (Math.random() - 0.2) * 600
    shooting.y = 180 + Math.random() * 160
    shooting.z = -80 + Math.random() * 80
    shooting.vx = 220 + Math.random() * 160
    shooting.vy = -140 - Math.random() * 80
    shooting.life = 1
  }

  // ---------- 鼠标轻微视差 ----------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  function onPointerMove(event) {
    pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2
    pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  // ---------- 尺寸 / 可见性 ----------
  function onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w, h)
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2)
  }
  window.addEventListener('resize', onResize)

  let running = true
  function onVisibility() {
    running = document.visibilityState === 'visible'
  }
  document.addEventListener('visibilitychange', onVisibility)

  const clock = new THREE.Clock()
  let frameId = 0

  function animate() {
    frameId = requestAnimationFrame(animate)
    if (!running) return

    const elapsed = clock.getElapsedTime()
    const delta = Math.min(clock.getDelta(), 0.05)
    material.uniforms.uTime.value = elapsed

    pointer.x += (pointer.tx - pointer.x) * 0.04
    pointer.y += (pointer.ty - pointer.y) * 0.04
    camera.position.x = pointer.x * 18
    camera.position.y = -pointer.y * 12
    camera.lookAt(0, 0, 0)

    stars.rotation.y = elapsed * 0.012
    stars.rotation.x = Math.sin(elapsed * 0.05) * 0.02

    // 流星状态机
    if (!shooting.active) {
      shooting.timer += delta
      if (shooting.timer >= shooting.next) {
        shooting.timer = 0
        shooting.next = 3 + Math.random() * 6
        spawnShooting()
      }
      shootingMaterial.opacity = 0
    } else {
      shooting.x += shooting.vx * delta
      shooting.y += shooting.vy * delta
      shooting.life -= delta * 0.85
      const len = 70
      const dirX = shooting.vx
      const dirY = shooting.vy
      const dirLen = Math.hypot(dirX, dirY) || 1
      const nx = dirX / dirLen
      const ny = dirY / dirLen
      const pos = shootingGeometry.attributes.position.array
      pos[0] = shooting.x
      pos[1] = shooting.y
      pos[2] = shooting.z
      pos[3] = shooting.x - nx * len
      pos[4] = shooting.y - ny * len
      pos[5] = shooting.z
      shootingGeometry.attributes.position.needsUpdate = true
      shootingMaterial.opacity = Math.max(0, shooting.life)
      if (shooting.life <= 0) shooting.active = false
    }

    renderer.render(scene, camera)
  }

  animate()

  return () => {
    running = false
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('visibilitychange', onVisibility)
    geometry.dispose()
    material.dispose()
    shootingGeometry.dispose()
    shootingMaterial.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === host) {
      host.removeChild(renderer.domElement)
    }
  }
}

const emit = defineEmits(['failed'])

onMounted(() => {
  if (!hostRef.value) return
  try {
    disposeScene = setupStarfield(hostRef.value)
  } catch (error) {
    console.warn('[StarfieldWebGL] 初始化失败，将由外层回退 2D 星空：', error)
    emit('failed', error)
  }
})

onUnmounted(() => {
  if (disposeScene) disposeScene()
  disposeScene = null
})
</script>

<style scoped>
.starfield-webgl {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.starfield-webgl :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
