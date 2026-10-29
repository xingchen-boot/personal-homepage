<template>
  <!--
    暗色背景入口：
    - 优先异步加载 WebGL 星空
    - 加载失败 / 用户关闭 / 设备不支持 → 回退现有 2D canvas 星空
  -->
  <Suspense v-if="showWebGL">
    <template #default>
      <StarfieldWebGL @failed="forceFallback = true" />
    </template>
    <template #fallback>
      <StarryBackground />
    </template>
  </Suspense>
  <StarryBackground v-else />
</template>

<script setup>
import { computed, defineAsyncComponent, onErrorCaptured, ref } from 'vue'
import { useWebGLBackground } from '../composables/useWebGLBackground'
import StarryBackground from './StarryBackground.vue'

const { useWebGLStars } = useWebGLBackground()

/** WebGL 组件加载或运行失败时强制降级到 2D */
const forceFallback = ref(false)

const StarfieldWebGL = defineAsyncComponent({
  loader: () => import('./StarfieldWebGL.vue'),
  onError() {
    forceFallback.value = true
  },
})

const showWebGL = computed(() => useWebGLStars.value && !forceFallback.value)

onErrorCaptured((error) => {
  console.warn('[DarkSkyBackground] WebGL 出错，降级 2D：', error)
  forceFallback.value = true
  return false
})
</script>
