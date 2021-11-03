import { createMachine } from 'xstate'
import { SnakeContext, SnakeEvent } from 'src/types'
import * as snakeActions from './snake.actions'

const snakeMachine = createMachine<SnakeContext, SnakeEvent>(
  {
    id: 'snake',
    initial: 'idle',
    context: {
      body: [
        { x: 7, y: 5, direction: 'right' },
        { x: 6, y: 5, direction: 'right' },
        { x: 5, y: 5, direction: 'right' },
        { x: 4, y: 5, direction: 'right' },
        { x: 3, y: 5, direction: 'right' },
        { x: 2, y: 5, direction: 'right' },
        { x: 1, y: 5, direction: 'right' },
        { x: 0, y: 5, direction: 'right' },
      ],
    },
    states: {
      idle: {
        on: {
          UPDATE_POSITION: {
            actions: ['appendBody', 'removeLastBody'],
          },
          EAT_FOOD: 'eatingFood',
          EAT_BONUS: 'eatingBonus',
          CRASH: 'crashing',
        },
      },
      eatingFood: {
        on: {
          UPDATE_POSITION: {
            target: 'idle',
            actions: ['appendBody', 'registerFoodEaten'],
          },
        },
      },
      eatingBonus: {
        on: {
          UPDATE_POSITION: {
            target: 'idle',
            actions: ['appendBody', 'registerFoodEaten', 'removeLastBody'],
          },
        },
      },
      crashing: {
        on: {
          UPDATE_POSITION: {
            target: 'idle',
            actions: ['appendBody', 'removeLastBody'],
          },
          EAT_FOOD: 'eatingFood',
          EAT_BONUS: 'eatingBonus',
        },
      },
    },
  },
  {
    actions: snakeActions,
  }
)

export default snakeMachine
