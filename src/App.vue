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
  overscroll-behavior: contain;
  overflow-x: hidden;
}

#app {
  min-height: 100%;
}
</style>
