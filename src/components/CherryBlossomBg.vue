<template>
  <canvas ref="canvasRef" class="cherry-blossom-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null

/**
 * 樱花花瓣类
 * 管理单个花瓣的位置、旋转、透明度等属性
 */
class Petal {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight, true)
  }

  reset(canvasWidth, canvasHeight, init = false) {
    this.x = Math.random() * canvasWidth
    this.y = init ? Math.random() * canvasHeight : -20
    this.size = Math.random() * 12 + 6
    this.speedX = Math.random() * 1.5 - 0.75
    this.speedY = Math.random() * 1.2 + 0.5
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.03
    this.opacity = Math.random() * 0.5 + 0.3
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = Math.random() * 0.02 + 0.01
  }

  update(canvasWidth, canvasHeight) {
    this.wobble += this.wobbleSpeed
    this.x += this.speedX + Math.sin(this.wobble) * 0.5
    this.y += this.speedY
    this.rotation += this.rotationSpeed

    if (this.y > canvasHeight + 20 || this.x < -20 || this.x > canvasWidth + 20) {
      this.reset(canvasWidth, canvasHeight)
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = this.opacity

    // 绘制樱花花瓣形状
    ctx.beginPath()
    const petalPath = new Path2D()
    petalPath.moveTo(0, 0)
    petalPath.bezierCurveTo(
      this.size * 0.4, -this.size * 0.5,
      this.size, -this.size * 0.3,
      this.size, 0
    )
    petalPath.bezierCurveTo(
      this.size, this.size * 0.3,
      this.size * 0.4, this.size * 0.5,
      0, 0
    )
    ctx.fillStyle = this.getPetalColor()
    ctx.fill(petalPath)

    ctx.restore()
  }

  getPetalColor() {
    const colors = [
      'rgba(255, 183, 197, ',   // 樱粉
      'rgba(255, 200, 210, ',   // 浅粉
      'rgba(255, 220, 225, ',   // 淡粉
      'rgba(255, 160, 180, ',   // 深粉
      'rgba(255, 230, 235, ',   // 极淡粉
    ]
    const baseColor = colors[Math.floor(Math.random() * colors.length)]
    return baseColor + this.opacity + ')'
  }
}

/**
 * 初始化Canvas樱花飘落效果
 */
function initCherryBlossom(canvas) {
  const ctx = canvas.getContext('2d')
  const petals = []
  const petalCount = 70

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  // 创建花瓣
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal(canvas.width, canvas.height))
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    petals.forEach(petal => {
      petal.update(canvas.width, canvas.height)
      petal.draw(ctx)
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(animationId)
  }
}

let cleanup = null

onMounted(() => {
  if (canvasRef.value) {
    cleanup = initCherryBlossom(canvasRef.value)
  }
})

onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<style scoped>
.cherry-blossom-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
