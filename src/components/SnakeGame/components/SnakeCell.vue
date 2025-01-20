<template>
  <div class="game-snake">
    <div
      v-for="(pos, index) in positions"
      :key="index"
      class="snake-segment"
      :style="getSegmentStyle(pos)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Position } from '../types';

const props = defineProps<{
  positions: Position[];
  gridSize: number;
}>();

const getSegmentStyle = (pos: Position) => ({
  width: `${props.gridSize}px`,
  height: `${props.gridSize}px`,
  left: `${pos.x * props.gridSize}px`,
  top: `${pos.y * props.gridSize}px`,
});
</script>

<style scoped>
.game-snake {
  position: relative;
}

.snake-segment {
  position: absolute;
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
  transition: all 0.1s ease;
}

.snake-segment:first-child {
  background: linear-gradient(45deg, #00ff9d, #00ff9d);
  box-shadow: 0 0 15px rgba(0, 255, 157, 0.8);
}
</style>
