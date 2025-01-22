<template>
  <div
    class="food-cell"
    :style="{
      left: `${position.x * gridSize}px`,
      top: `${position.y * gridSize}px`,
      width: `${gridSize}px`,
      height: `${gridSize}px`
    }"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Position } from '../types';

defineProps<{
  position: Position;
  gridSize: number;
}>();
</script>

<style scoped>
.food-cell {
  position: absolute;
  background: #ff0099;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 0, 153, 0.6);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
}
</style>
