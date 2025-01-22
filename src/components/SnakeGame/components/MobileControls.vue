<template>
  <div class="mobile-controls" v-if="props.isMobileDevice">
    <div class="joystick-base" ref="joystickBase" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
      <div class="joystick-stick" :style="stickStyle" ref="joystickStick">
        <div v-if="currentDirection" class="joystick-arrow" :style="arrowStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps<{
  isMobileDevice: boolean
}>();

const emit = defineEmits<{
  (e: 'direction', direction: string): void
}>();

const joystickBase = ref<HTMLElement | null>(null);
const joystickStick = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const currentDirection = ref('');
const stickPosition = ref({ x: 0, y: 0 });

const MAX_DISTANCE = 50; // 最大拖动距离

const stickStyle = computed(() => ({
  transform: `translate(calc(-50% + ${stickPosition.value.x}px), calc(-50% + ${stickPosition.value.y}px))`,
}));

const arrowStyle = computed(() => ({
  transform: `rotate(${getRotationDegree(currentDirection.value)}deg)`,
}));

function getRotationDegree(direction: string): number {
  switch (direction) {
    case 'up': return 90;     // 原来是 -90，改为 90
    case 'right': return 180; // 原来是 0，改为 180
    case 'down': return -90;  // 原来是 90，改为 -90
    case 'left': return 0;    // 原来是 180，改为 0
    default: return 0;
  }
}

const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || !joystickBase.value) return;
  event.preventDefault();
  
  const touch = event.touches[0];
  const baseRect = joystickBase.value.getBoundingClientRect();
  const centerX = baseRect.left + baseRect.width / 2;
  const centerY = baseRect.top + baseRect.height / 2;
  
  // 计算与中心点的偏移
  let deltaX = touch.clientX - centerX;
  let deltaY = touch.clientY - centerY;
  
  // 限制移动距离
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (distance > MAX_DISTANCE) {
    deltaX = (deltaX / distance) * MAX_DISTANCE;
    deltaY = (deltaY / distance) * MAX_DISTANCE;
  }
  
  // 更新操控杆位置，考虑到初始transform的偏移
  stickPosition.value = {
    x: deltaX,
    y: deltaY
  };
  
  // 判断方向
  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  let newDirection = '';
  
  if (distance > MAX_DISTANCE * 0.3) { // 添加死区
    if (angle < -135 || angle > 135) newDirection = 'left';
    else if (angle < -45) newDirection = 'up';
    else if (angle < 45) newDirection = 'right';
    else if (angle < 135) newDirection = 'down';
  }
  
  if (newDirection && newDirection !== currentDirection.value) {
    currentDirection.value = newDirection;
    emit('direction', newDirection);
  }
};

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault();
  isDragging.value = false;
  stickPosition.value = { x: 0, y: 0 };
  currentDirection.value = '';
};
</script>

<style scoped>
.mobile-controls {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.joystick-base {
  position: relative;
  width: 150px;
  height: 150px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 157, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  touch-action: none;
}

.joystick-stick {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 157, 0.15);
  border: 2px solid rgba(0, 255, 157, 0.5);
  border-radius: 50%;
  transition: transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;  /* 优化性能 */
}

/* 只在触摸结束时添加过渡效果 */
.joystick-stick.reset-position {
  transition: transform 0.2s ease;
}

.joystick-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 12px;
  border-color: transparent rgba(0, 255, 157, 0.8) transparent transparent;
  transition: transform 0.2s ease, opacity 0.2s ease;  /* 添加透明度过渡 */
  opacity: 0.8;  /* 稍微降低不透明度 */
}

@media (orientation: landscape) and (max-height: 600px) {
  .mobile-controls {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    padding: 10px;
  }

  .joystick-base {
    width: 120px;
    height: 120px;
  }

  .joystick-stick {
    width: 50px;
    height: 50px;
  }
}
</style>
