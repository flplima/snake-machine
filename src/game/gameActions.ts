import { assign, spawn, send } from 'xstate'

import snakeMachine from 'src/snake/snakeMachine'
import foodMachine from 'src/food/foodMachine'
import bonusMachine from 'src/bonus/bonusMachine'
import DrawGame from 'src/utils/drawGame'

import {
  getNextSnakePosition,
  getInitialContextForFood,
  getInitialContextForBonus,
} from './gameSelectors'

export const spawnSnake = assign({
  snake: () => spawn(snakeMachine),
})

export const spawnFood = assign({
  food: (context) =>
    spawn(foodMachine.withContext(getInitialContextForFood(context))),
})

export const spawnBonus = assign({
  bonus: (context) =>
    spawn(bonusMachine.withContext(getInitialContextForBonus(context))),
})

export const registerKeystroke = assign({
  keystrokes: (context, event) => [...context.keystrokes, event.key],
})

export const resetGameData = assign({
  keystrokes: [],
  countdownToBonus: 4,
  countdownToRemoveBonus: 20,
  bonus: null,
  score: 0,
})

export const removeKeystroke = assign({
  keystrokes: (context) => context.keystrokes.slice(1),
})

export const decreaseCountdownToBonus = assign({
  countdownToBonus: (context) =>
    context.bonus ? context.countdownToBonus : context.countdownToBonus - 1,
})

export const decreaseCountdownToRemoveBonus = assign({
  countdownToRemoveBonus: (context) => context.countdownToRemoveBonus - 1,
})

export const resetBonus = assign({
  bonus: null,
  countdownToBonus: 4,
  countdownToRemoveBonus: 20,
})

export const tellSnakeToEatFood = send('EAT_FOOD', {
  to: (context) => context.snake!,
})

export const tellSnakeToEatBonus = send('EAT_BONUS', {
  to: (context) => context.snake!,
})

export const tellSnakeToCrash = send('CRASH', {
  to: (context) => context.snake!,
})

export const updateSnakePosition = send(
  (context) => ({
    type: 'UPDATE_POSITION',
    position: getNextSnakePosition(context),
  }),
  { to: (context) => context.snake! }
)

export const decreaseSpeed = assign({
  speed: (context) => (context.speed > 1 ? context.speed - 1 : context.speed),
})

export const increaseSpeed = assign({
  speed: (context) => context.speed + 1,
})

export const updateScoreWithFood = assign({
  score: (context) => context.score + context.speed,
})

export const updateScoreWithBonus = assign({
  score: (context) => context.score + context.countdownToRemoveBonus,
})

export const drawGame = (context) => {
  new DrawGame({
    snake: context.snake.getSnapshot().context,
    food: context.food.getSnapshot().context,
    bonus: context.bonus?.getSnapshot().context,
    score: context.score,
    countdownToRemoveBonus: context.countdownToRemoveBonus,
  })
}

export const drawGameWithoutSnake = (context) => {
  new DrawGame({
    snake: null,
    food: context.food.getSnapshot().context,
    bonus: context.bonus?.getSnapshot().context,
    score: context.score,
    countdownToRemoveBonus: context.countdownToRemoveBonus,
  })
}

export const decreaseBlinkingCountdown = assign({
  blinkingCountdown: (context) => context.blinkingCountdown - 1,
})
