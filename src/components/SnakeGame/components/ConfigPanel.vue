<template>
  <div class="config-panel">
    <div class="size-control">
      <label>地图大小: {{ modelValue }}x{{ modelValue }}</label>
      <input
        type="range"
        :min="config.minSize"
        :max="config.maxSize"
        v-model="localSize"
        :disabled="disabled"
        class="slider"
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="handleTouchEnd"
      >
    </div>
    <div class="button-group">
      <button 
        class="game-button"
        :class="{ primary: !isRunning }"
        @click="$emit(isRunning ? 'reset' : 'start')"
      >
        {{ isRunning ? '重新开始' : '开始游戏' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { gameConfig } from '../config/gameConfig';

const props = defineProps<{
  modelValue: number;
  disabled: boolean;
  isRunning: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'start'): void;
  (e: 'reset'): void;
}>();

const localSize = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  localSize.value = newVal;
});

watch(localSize, (newVal) => {
  emit('update:modelValue', newVal);
});

const config = gameConfig;

const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  const input = event.target as HTMLInputElement;
  const rect = input.getBoundingClientRect();
  const pos = (touch.clientX - rect.left) / rect.width;
  const value = config.minSize + (config.maxSize - config.minSize) * pos;
  localSize.value = Math.round(Math.min(Math.max(value, config.minSize), config.maxSize));
};

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0];
  const input = event.target as HTMLInputElement;
  const rect = input.getBoundingClientRect();
  const pos = (touch.clientX - rect.left) / rect.width;
  const value = config.minSize + (config.maxSize - config.minSize) * pos;
  localSize.value = Math.round(Math.min(Math.max(value, config.minSize), config.maxSize));
};

const handleTouchEnd = () => {
  emit('update:modelValue', localSize.value);
};
</script>

<style scoped>
.config-panel {
  width: 90%;
  max-width: 400px;
  padding: 5px 10px;
  background: rgba(0, 255, 157, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 157, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.size-control {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.size-control label {
  color: var(--primary-color);
  font-size: 1.1rem;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  outline: none;
  touch-action: none;
  position: relative;
  border: 1px solid rgba(0, 255, 157, 0.3);
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(0, 255, 157, 0.2);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 0 15px rgba(0, 255, 157, 0.5),
    0 0 5px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: linear-gradient(45deg, #00ff9d, #00ff9d);
  box-shadow: 
    0 0 20px rgba(0, 255, 157, 0.7),
    0 0 10px rgba(0, 0, 0, 0.4);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
  background: linear-gradient(45deg, #00cc7e, #00ff9d);
}

/* 添加滑动轨道的激活状态样式 */
.slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    rgba(0, 255, 157, 0.3) 0%,
    rgba(0, 255, 157, 0.1) 100%
  );
}

.button-group {
  display: flex;
  justify-content: center;
}

.game-button {
  padding: 5px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(45deg, rgba(0, 255, 157, 0.1), rgba(255, 0, 153, 0.1));
  color: var(--text-primary);
  border: 1px solid rgba(0, 255, 157, 0.2);
  text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
}

.game-button.primary {
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: #1a1a2e;
  text-shadow: none;
}

.game-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 255, 157, 0.3);
}

.game-button:active {
  transform: translateY(0);
}

.game-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 修改全局样式 */
:global(body) {
  touch-action: pan-x pan-y; /* 允许页面滚动 */
}

:global(.game-wrapper) {
  touch-action: pan-x pan-y; /* 允许页面滚动 */
}

:global(.direction-pad) {
  touch-action: none; /* 只在控制按钮区域禁用默认触摸行为 */
}

:global(.slider) {
  touch-action: none; /* 只在滑块上禁用默认触摸行为 */
}
</style>
