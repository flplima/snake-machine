import { Interpreter } from 'xstate'

export interface GameContext {
  snake: Interpreter<SnakeContext> | null
  food: Interpreter<FoodContext> | null
  bonus: Interpreter<BonusContext> | null
  keystrokes: Array<'up' | 'down' | 'left' | 'right'>
  countdownToBonus: number
  countdownToRemoveBonus: number
  speed: number
  score: number
}

export interface SnakePosition {
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right'
  withFood?: boolean
}

export interface SnakeContext {
  body: SnakePosition[]
}

export interface UpdatePositionEvent {
  type: 'UPDATE_POSITION'
  position: SnakePosition
}

export interface EatFoodEvent {
  type: 'EAT_FOOD'
}

export interface EatBonusEvent {
  type: 'EAT_BONUS'
}

export interface CrashEvent {
  type: 'CRASH'
}

export type SnakeEvent =
  | UpdatePositionEvent
  | EatFoodEvent
  | EatBonusEvent
  | CrashEvent

export interface FoodContext {
  x: number
  y: number
}

export interface BonusContext {
  x: number
  y: number
  spriteIndex: number
}
