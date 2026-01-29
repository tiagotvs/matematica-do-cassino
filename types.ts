export interface SimulationConfig {
  initialBalance: number;
  betAmount: number;
  winChance: number; // 0 to 1
  totalPlayers: number;
}

export interface PlayerState {
  id: number;
  balance: number;
  history: number[];
  isBust: boolean;
}

export enum GameState {
  IDLE,
  RUNNING,
  FINISHED
}