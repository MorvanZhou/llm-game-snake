export interface Position {
  x: number;
  y: number;
}

export enum CellType {
  Empty = 0,
  Snake = 1,
  Food = 2
}

export interface GameState {
  isRunning: boolean;
  speed: number;
  score: number;
}

export interface GameConfig {
  initialSpeed: number;
  minSpeed: number;
  speedIncrement: number;
  minSize: number;
  maxSize: number;
  gridSize: number;
}
