<template>
  <SnakeGame/>
</template>

<script setup lang="ts">
import SnakeGame from './components/SnakeGame.vue';
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; /* 添加平滑滚动 */
}

#app {
  min-height: 100%;
}
</style>
