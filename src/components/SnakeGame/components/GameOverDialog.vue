<template>
  <Transition name="fade">
    <div v-if="show" class="dialog-overlay" @click.self="$emit('close')">
      <div class="dialog-content">
        <h2>游戏结束!</h2>
        <div class="score-info">
          <p>本局得分: <span class="highlight">{{ score }}</span></p>
          <p>最高分: <span class="highlight">{{ highScore }}</span></p>
        </div>
        <div class="buttons">
          <button class="retry-btn" @click="$emit('retry')">再试一次</button>
          <button class="close-btn" @click="$emit('close')">返回</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';
defineProps<{
  show: boolean;
  score: number;
  highScore: number;
}>();

defineEmits<{
  (e: 'retry'): void;
  (e: 'close'): void;
}>();
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 30px rgba(0, 255, 157, 0.2);
  text-align: center;
  min-width: 300px;
}

h2 {
  color: var(--primary-color);
  margin: 0 0 20px;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
}

.score-info {
  margin-bottom: 25px;
}

.score-info p {
  color: var(--text-secondary);
  margin: 10px 0;
  font-size: 1.1rem;
}

.highlight {
  color: var(--primary-color);
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.retry-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn {
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: #1a1a2e;
  font-weight: bold;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.retry-btn:hover, .close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 255, 157, 0.3);
}

.retry-btn:active, .close-btn:active {
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .dialog-content {
    margin: 0 20px;
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .score-info p {
    font-size: 1rem;
  }

  .highlight {
    font-size: 1.2rem;
  }
}
</style>