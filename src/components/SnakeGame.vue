<template>
  <div class="game-wrapper">
    <div class="game-container">
      <div class="game-header">
        <h1 class="game-title">贪吃蛇</h1>
        <div class="score-panel">
          <div class="score-item">
            <span class="score-label">得分</span>
            <span class="score-value">{{ score }}</span>
          </div>
          <div class="score-item">
            <span class="score-label">最高分</span>
            <span class="score-value">{{ highScore }}</span>
          </div>
        </div>
      </div>
      
      <div class="game-content">
        <config-panel
          v-model="selectedSize"
          :disabled="isGameRunning"
          :is-running="isGameRunning"
          @start="startGame"
          @reset="resetGame"
        />
        <game-board
          :size="selectedSize"
          :snake="snake"
          :food="food"
        />
      </div>

      <div class="game-controls">
        <mobile-controls
          :is-mobile-device="isMobileDevice"
          @direction="handleDirection"
        />
      </div>
    </div>
  </div>

  <GameOverDialog
    v-if="showGameOver"
    :show="showGameOver"
    :score="score"
    :high-score="highScore"
    @retry="handleRetry"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import type { Position } from './SnakeGame/types';
import { gameConfig } from './SnakeGame/config/gameConfig';
import ConfigPanel from './SnakeGame/components/ConfigPanel.vue';
import GameBoard from './SnakeGame/components/GameBoard.vue';
import GameOverDialog from './SnakeGame/components/GameOverDialog.vue';
import MobileControls from './SnakeGame/components/MobileControls.vue';

// 游戏状态
const snake = ref<Position[]>([{ x: 0, y: 0 }]);
const food = ref<Position>({x: 0, y: 0});
const direction = ref('right');
const speed = ref(gameConfig.initialSpeed);
const intervalId = ref<number | null>(null);
const lastDirection = ref('right');
const selectedSize = ref(gameConfig.minSize);
const isGameRunning = ref(false);
const score = ref(0);
const highScore = ref(Number(localStorage.getItem('snakeHighScore')) || 0);
const isMobileDevice = ref(false);
const showGameOver = ref(false);

const startGame = () => {
  direction.value = 'right';
  lastDirection.value = 'right';
  isGameRunning.value = true;
  speed.value = gameConfig.initialSpeed;
  
  if (intervalId.value) clearInterval(intervalId.value);
  intervalId.value = setInterval(() => {
    moveSnake();
    checkCollision();
  }, speed.value);
};

const resetGame = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  isGameRunning.value = false;
  snake.value = [{ x: 0, y: 0 }];
  food.value = generateFood();
  score.value = 0;
  speed.value = gameConfig.initialSpeed;
};

const moveSnake = () => {
  const head = { ...snake.value[0] };
  lastDirection.value = direction.value;
  
  switch (direction.value) {
    case 'up':
      head.y = (head.y - 1 + selectedSize.value) % selectedSize.value;
      break;
    case 'down':
      head.y = (head.y + 1) % selectedSize.value;
      break;
    case 'left':
      head.x = (head.x - 1 + selectedSize.value) % selectedSize.value;
      break;
    case 'right':
      head.x = (head.x + 1) % selectedSize.value;
      break;
  }
  
  snake.value.unshift(head);
  if (head.x === food.value.x && head.y === food.value.y) {
    food.value = generateFood();
    updateScore();
    increaseSpeed();
  } else {
    snake.value.pop();
  }
};

const generateFood = (): Position => {
  const size = selectedSize.value;
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size)
    };
  } while (snake.value.some(segment => 
    segment.x === newFood.x && segment.y === newFood.y
  ));
  return newFood;
};

const checkCollision = () => {
  const head = snake.value[0];
  if (snake.value.some((part, index) => 
    index !== 0 && part.x === head.x && part.y === head.y
  )) {
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
    showGameOver.value = true; // 显示游戏结束对话框
  }
};

const updateScore = () => {
  score.value += 10;
  if (score.value > highScore.value) {
    highScore.value = score.value;
    localStorage.setItem('snakeHighScore', String(highScore.value));
  }
};

const increaseSpeed = () => {
  if (speed.value > gameConfig.minSpeed) {
    speed.value = Math.max(gameConfig.minSpeed, speed.value - gameConfig.speedIncrement);
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = setInterval(() => {
        moveSnake();
        checkCollision();
      }, speed.value);
    }
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key.startsWith('Arrow')) {
    event.preventDefault();
    
    switch (event.key) {
      case 'ArrowUp':
        if (lastDirection.value !== 'down') direction.value = 'up';
        break;
      case 'ArrowDown':
        if (lastDirection.value !== 'up') direction.value = 'down';
        break;
      case 'ArrowLeft':
        if (lastDirection.value !== 'right') direction.value = 'left';
        break;
      case 'ArrowRight':
        if (lastDirection.value !== 'left') direction.value = 'right';
        break;
    }
  }
};

const handleDirection = (dir: string) => {
  switch (dir) {
    case 'up':
      if (lastDirection.value !== 'down') direction.value = 'up';
      break;
    case 'down':
      if (lastDirection.value !== 'up') direction.value = 'down';
      break;
    case 'left':
      if (lastDirection.value !== 'right') direction.value = 'left';
      break;
    case 'right':
      if (lastDirection.value !== 'left') direction.value = 'right';
      break;
  }
};

const handleClose = () => {
  showGameOver.value = false;
  resetGame();
};

const handleRetry = () => {
  showGameOver.value = false;
  resetGame();
  startGame();
};

// 添加对 selectedSize 的监听
watch(selectedSize, () => {
  if (!isGameRunning.value) {
    // 只在游戏未运行时重置蛇和食物的位置
    snake.value = [{ x: 0, y: 0 }];
    food.value = generateFood();
  }
});

// 生命周期钩子
onMounted(() => {
    window.addEventListener('keydown', handleKeyPress);
    food.value = generateFood();
    const checkMobile = () => {
        isMobileDevice.value = window.innerWidth <= 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
:root {
  --primary-color: #00ff9d;
  --secondary-color: #ff0099;
  --background-dark: #1a1a2e;
  --panel-bg: rgba(255, 255, 255, 0.08);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
}

.game-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 改为 flex-start */
  padding: 0 5px;
  -webkit-overflow-scrolling: touch; /* 移动端滚动优化 */
}

.game-container {
  width: 100%;
  max-width: 1200px;
  margin: 10px auto; /* 添加上下边距 */
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
  background: var(--panel-bg);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 157, 0.1);
}

.game-header {
  text-align: center;
}

.game-title {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0 auto;
  color: var(--primary-color);
  text-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
}

.score-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
  background: rgba(0, 255, 157, 0.1);
  border-radius: 10px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.score-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.score-value {
  color: var(--primary-color);
  font-size: 1.2rem;
  font-weight: bold;
}

.game-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .game-container {
    padding: 5px;
    width: 100%;
  }

  .game-header {
    margin-bottom: 5px;
  }

  .game-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .score-panel {
    padding: 8px;
    gap: 8px;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    grid-template-columns: 1fr;
  }

  .game-content {
    gap: 10px;
    width: 100%;
  }

  .direction-btn {
    width: 95px;
    height: 65px;
    font-size: 26px;
  }
}

@media (min-width: 769px) {
  .mobile-controls {
    display: none;
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .game-wrapper {
    padding: 5px;
  }

  .game-container {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px;
  }

  .game-header {
    flex: 0 0 auto;
    margin-right: 10px;
  }

  .game-content {
    flex: 1;
    min-width: 0;
  }

  .mobile-controls {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    padding: 10px;
  }

  .direction-btn {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .game-title {
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  .score-panel {
    flex-direction: column;
    padding: 5px;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>