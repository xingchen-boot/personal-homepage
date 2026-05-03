<template>
  <canvas ref="canvasRef" class="starry-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null

class Star {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.size = Math.random() * 2 + 0.5
    this.twinkleSpeed = Math.random() * 0.02 + 0.005
    this.twinklePhase = Math.random() * Math.PI * 2
  }

  draw(ctx) {
    this.twinklePhase += this.twinkleSpeed
    const opacity = 0.3 + Math.sin(this.twinklePhase) * 0.4

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.fill()
  }
}

class ShootingStar {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight)
  }

  reset(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth * 0.7
    this.y = Math.random() * canvasHeight * 0.4
    this.length = Math.random() * 80 + 40
    this.speed = Math.random() * 8 + 6
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3
    this.opacity = 1
    this.active = false
    this.timer = 0
    this.interval = Math.random() * 80 + 30
  }

  update(canvasWidth, canvasHeight) {
    if (!this.active) {
      this.timer++
      if (this.timer >= this.interval) {
        this.active = true
        this.opacity = 1
        this.x = Math.random() * canvasWidth * 0.7
        this.y = Math.random() * canvasHeight * 0.3
      }
      return
    }

    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
    this.opacity -= 0.015

    if (this.opacity <= 0 || this.x > canvasWidth || this.y > canvasHeight) {
      this.active = false
      this.timer = 0
      this.interval = Math.random() * 80 + 30
    }
  }

  draw(ctx) {
    if (!this.active || this.opacity <= 0) return

    const tailX = this.x - Math.cos(this.angle) * this.length
    const tailY = this.y - Math.sin(this.angle) * this.length

    const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`)
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(tailX, tailY)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 流星头部亮点
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.fill()
  }
}

function initStarrySky(canvas) {
  const ctx = canvas.getContext('2d')
  const stars = []
  const shootingStars = []
  const starCount = 120
  const shootingStarCount = 6

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star(canvas.width, canvas.height))
  }

  for (let i = 0; i < shootingStarCount; i++) {
    shootingStars.push(new ShootingStar(canvas.width, canvas.height))
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#0a0a1a')
    gradient.addColorStop(0.5, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制星星
    stars.forEach(star => star.draw(ctx))

    // 绘制流星
    shootingStars.forEach(s => {
      s.update(canvas.width, canvas.height)
      s.draw(ctx)
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
    cleanup = initStarrySky(canvasRef.value)
  }
})

onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<style scoped>
.starry-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
