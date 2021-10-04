import { GAME_HEIGHT, GAME_WIDTH } from 'src/constants'
import * as drawingMaps from 'src/drawingMaps'
import { GameContext } from './gameTypes'

export const getInitialContextForFood = (context: GameContext) => {
  let isEmpty, x, y
  const bonusContext = context.bonus?.getSnapshot().context || {}
  const snakeContext = context.snake!.getSnapshot().context
  do {
    x = Math.floor(Math.random() * (GAME_WIDTH + 1))
    y = Math.floor(Math.random() * (GAME_HEIGHT + 1))

    if (
      (x === bonusContext.x && y === bonusContext.y) ||
      (x === bonusContext.x + 1 && y === bonusContext.y) ||
      snakeContext.body
        .slice(0, -1)
        .some((item) => x === item.x && y === item.y)
    ) {
      isEmpty = false
    } else {
      isEmpty = true
    }
  } while (!isEmpty)

  return { x, y }
}

export const getInitialContextForBonus = (context: GameContext) => {
  let isEmpty, x, y
  const foodContext = context.food.getSnapshot().context
  const snakeContext = context.snake.getSnapshot().context
  do {
    x = Math.floor(Math.random() * (GAME_WIDTH + 1))
    y = Math.floor(Math.random() * (GAME_HEIGHT + 1))

    if (
      (x === foodContext.x && y === foodContext.y) ||
      snakeContext.body
        .slice(0, -1)
        .some((item) => x === item.x && y === item.y)
    ) {
      isEmpty = false
    } else {
      isEmpty = true
    }
  } while (!isEmpty)

  return {
    spriteIndex: Math.floor(Math.random() * drawingMaps.bonus.length),
    x,
    y,
  }
}

export const getNextSnakePosition = (context: GameContext) => {
  const snakeHead = getSnakeHead(context)
  const direction = context.keystrokes[0] || snakeHead.direction

  let x = snakeHead.x
  let y = snakeHead.y

  switch (direction) {
    case 'down':
      y = snakeHead.y === GAME_HEIGHT ? 0 : snakeHead.y + 1
      break
    case 'up':
      y = snakeHead.y === 0 ? GAME_HEIGHT : snakeHead.y - 1
      break
    case 'right':
      x = snakeHead.x === GAME_WIDTH ? 0 : snakeHead.x + 1
      break
    case 'left':
      x = snakeHead.x === 0 ? GAME_WIDTH : snakeHead.x - 1
      break
  }

  return { x, y, direction }
}

export const getSnakeHead = (context: GameContext) => {
  return context.snake!.getSnapshot().context.body[0]
}
