<script setup lang="ts">
import { useSnakeGame } from './useSnakeGame';
import { Position } from './types';

const { snake, food, moveSnake, changeDirection, isGameOver, resetGame } = useSnakeGame();

const getSegmentStyle = (pos: Position) => {
  const size = getComputedStyle(document.documentElement)
    .getPropertyValue('--grid-size')
    .trim()
    .replace('px', '');
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${pos.x * parseInt(size)}px`,
    top: `${pos.y * parseInt(size)}px`,
  };
};
</script>

<template>
  <div class="game-board">
    <div
      v-for="(segment, index) in snake"
      :key="index"
      class="snake-segment"
      :style="getSegmentStyle(segment)"
    ></div>
    <div class="food" :style="getSegmentStyle(food)"></div>
  </div>
  <div class="controls">
    <button @click="resetGame">Reset</button>
  </div>
</template>

<style scoped>
.game-board {
  position: relative;
  width: var(--board-size);
  height: var(--board-size);
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.snake-segment {
  position: absolute;
  background-color: #333;
}

.food {
  position: absolute;
  background-color: red;
}

.controls {
  margin-top: 10px;
}
</style>
