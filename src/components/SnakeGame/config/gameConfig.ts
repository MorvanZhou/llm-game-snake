import type { GameConfig } from '../types';

export const gameConfig: GameConfig = {
  initialSpeed: 500,    // 初始速度：0.5秒/格
  minSpeed: 200,        // 最快速度：0.2秒/格
  speedIncrement: 20,   // 每次加速：0.02秒/格
  minSize: 5,
  maxSize: 20,
  gridSize: 20,        // 像素尺寸
};
