<template>
  <div
    class="game-food"
    :style="getFoodStyle"
  />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { Position } from '../types';

const props = defineProps<{
  position: Position;
  gridSize: number;
}>();

const getFoodStyle = computed(() => ({
  width: `${props.gridSize}px`,
  height: `${props.gridSize}px`,
  left: `${props.position.x * props.gridSize}px`,
  top: `${props.position.y * props.gridSize}px`,
}));
</script>

<style scoped>
.game-food {
  position: absolute;
  background: linear-gradient(45deg, #ff0099, #ff4d4d);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 0, 153, 0.6);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 0, 153, 0.6);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 0, 153, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 0, 153, 0.6);
  }
}
</style>
