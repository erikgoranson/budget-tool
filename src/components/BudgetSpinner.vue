<script setup lang="ts">
//like a fidget spinner. GET IT?
import type { LucideIcon } from 'lucide-vue-next';
import { ref, onUnmounted, onMounted } from 'vue';
import { PiggyBank } from 'lucide-vue-next';

const props = defineProps({
    icon : {
        type: Object as () => LucideIcon,
        required: false,
    }
});

const currentRotation = ref<number>(0)
const currentSpeed = ref<number>(0)
let animationFrameId: ReturnType<typeof requestAnimationFrame> | null = null

const updateAnimation = (): void => {
  if (currentSpeed.value > 0.1) {
    currentRotation.value = (currentRotation.value + currentSpeed.value) % 360
    currentSpeed.value *= 0.98
    animationFrameId = requestAnimationFrame(updateAnimation)
    return
  }

  const currentAngle = currentRotation.value % 360
  const distanceToTarget = 360 - currentAngle

  if (distanceToTarget > 0.5 && currentAngle > 0.5) {
    currentRotation.value += distanceToTarget * 0.15
    animationFrameId = requestAnimationFrame(updateAnimation)
  } else {
    currentRotation.value = 0
    currentSpeed.value = 0
    animationFrameId = null
  }
}

const spin = (): void => {
  currentSpeed.value += 15
  if (currentSpeed.value > 60) currentSpeed.value = 60

  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(updateAnimation)
  }
}

const handleVisibilityChange = (): void => {
  if (document.hidden) {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  } else {
    if (!animationFrameId && (currentSpeed.value > 0.1 || currentRotation.value > 0)) {
      animationFrameId = requestAnimationFrame(updateAnimation)
    }
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
    <component :is="icon ?? PiggyBank" 
        class="h-16 w-16 transition-none" 
        :style="{ transform: `rotate(${currentRotation}deg)` }"
        @click="spin"
    />
</template>
