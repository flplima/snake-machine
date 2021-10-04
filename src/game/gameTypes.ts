import { Interpreter } from 'xstate'
import { SnakeContext } from 'src/snake/snakeTypes'
import { FoodContext } from 'src/food/foodTypes'
import { BonusContext } from 'src/bonus/bonusTypes'

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
