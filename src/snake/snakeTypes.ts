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
