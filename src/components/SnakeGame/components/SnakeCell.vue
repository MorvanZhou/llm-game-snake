<template>
  <div class="snake-container">
    <div
      v-for="(pos, index) in props.positions"
      :key="`snake-${pos.x}-${pos.y}`"
      class="snake-segment"
      :class="{ 'snake-head': index === 0 }"
      :style="{
        left: `${pos.x * props.gridSize}px`,
        top: `${pos.y * props.gridSize}px`,
        width: `${props.gridSize}px`,
        height: `${props.gridSize}px`
      }"
    >
      <div v-if="index === 0" class="snake-eyes"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Position } from '../types';

const props = defineProps<{
  positions: Position[];
  gridSize: number;
}>();
</script>

<style scoped>
.snake-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.snake-segment {
  position: absolute;
  transition: all 0.15s linear;
  border-radius: 4px;
  background: #00c977;  /* 更亮的绿色 */
  box-shadow: 0 0 8px rgba(0, 201, 119, 0.7);  /* 更明显的阴影 */
  border: 1px solid rgba(0, 255, 157, 0.8);  /* 添加边框 */
}

.snake-head {
  background: #ff9d00;  /* 保持橙色蛇头 */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 157, 0, 0.8);
  border: 2px solid #ffd700;
  transform: scale(1.1);
  z-index: 2;
}

.snake-eyes {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15%;
}

.snake-eyes::before,
.snake-eyes::after {
  content: '';
  width: 30%;
  height: 30%;
  background: #000;
  border-radius: 50%;
  box-shadow: 0 0 2px #000;
}
</style>
