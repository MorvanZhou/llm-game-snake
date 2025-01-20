<template>
  <div class="game-board" ref="boardRef">
    <snake-body-component :positions="snake" :grid-size="cellSize" />
    <food-item-component :position="food" :grid-size="cellSize" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import type { Position } from '../types';
import SnakeBodyComponent from './SnakeCell.vue';
import FoodItemComponent from './FoodCell.vue';

const props = defineProps<{
  size: number;
  snake: Position[];
  food: Position;
}>();

const boardRef = ref<HTMLElement | null>(null);
const cellSize = ref(20); // 初始格子大小

const updateBoardSize = () => {
  if (!boardRef.value) return;
  
  // 计算可用空间
  const isMobile = window.innerWidth <= 768;
  const containerWidth = Math.min(
    window.innerWidth * (isMobile ? 0.9 : 0.8),
    isMobile ? 800 : 600
  );
  const containerHeight = Math.min(
    window.innerHeight * (isMobile ? 0.5 : 0.6),
    isMobile ? 800 : 600
  );
  const minDimension = Math.min(containerWidth, containerHeight);
  
  // 计算单个格子的大小
  cellSize.value = Math.floor(minDimension / props.size);
  
  // 计算实际棋盘大小
  const boardSize = cellSize.value * props.size;
  
  // 更新棋盘大小
  boardRef.value.style.width = `${boardSize}px`;
  boardRef.value.style.height = `${boardSize}px`;
  boardRef.value.style.setProperty('--grid-size', `${cellSize.value}px`);
};

// 监听 size 和窗口大小变化
watch(() => props.size, updateBoardSize, { immediate: true });
watch(() => window.innerWidth, updateBoardSize);
watch(() => window.innerHeight, updateBoardSize);

onMounted(() => {
  updateBoardSize();
  window.addEventListener('resize', updateBoardSize);
  
  return () => window.removeEventListener('resize', updateBoardSize);
});
</script>

<style scoped>
.game-board {
  border: 2px solid rgba(0, 255, 157, 0.2);
  border-radius: 10px;
  position: relative;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  box-shadow: 
    0 0 20px rgba(0, 255, 157, 0.1),
    inset 0 0 20px rgba(0, 255, 157, 0.05);
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  margin: 0 auto;
}

.game-board::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 0%, rgba(0, 255, 157, 0.03) 50%, transparent 100%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent calc(var(--grid-size) - 1px),
      rgba(0, 255, 157, 0.05) var(--grid-size)
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent calc(var(--grid-size) - 1px),
      rgba(0, 255, 157, 0.05) var(--grid-size)
    );
  pointer-events: none;
}

@media (max-width: 768px) {
  .game-board {
    margin: 0 auto;
    border-width: 1px;
  }
}
</style>
