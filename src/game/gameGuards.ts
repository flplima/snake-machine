import { getNextSnakePosition, getSnakeHead } from './gameSelectors'

export const isValidKey = (context, event) => {
  const lastKeystroke = context.keystrokes[context.keystrokes.length - 1]
  const snakeHeadDirection = getSnakeHead(context).direction
  const previousDirection = lastKeystroke || snakeHeadDirection

  const validKeys = {
    up: ['left', 'right'],
    down: ['left', 'right'],
    left: ['up', 'down'],
    right: ['up', 'down'],
  }

  return validKeys[previousDirection].includes(event.key)
}

export const willEatFood = (context) => {
  const snakeHead = getNextSnakePosition(context)
  const foodContext = context.food.getSnapshot().context
  return snakeHead.x === foodContext.x && snakeHead.y === foodContext.y
}

export const willEatBonus = (context) => {
  const snakeHead = getNextSnakePosition(context)
  const bonusContext = context.bonus?.getSnapshot().context
  return (
    bonusContext &&
    ((snakeHead.x === bonusContext.x && snakeHead.y === bonusContext.y) ||
      (snakeHead.x === bonusContext.x + 1 && snakeHead.y === bonusContext.y))
  )
}

export const willCrash = (context) => {
  const { x, y } = getNextSnakePosition(context)
  const { body } = context.snake.getSnapshot().context
  return body.slice(0, -1).some((item) => x === item.x && y === item.y)
}

export const willDie = (context) => {
  return (
    willCrash(context) &&
    (context.keystrokes.length ||
      context.snake.getSnapshot().matches('crashing'))
  )
}

export const isTimeForBonus = (context) => {
  return context.countdownToBonus === 0 && !context.bonus
}

export const countdownToRemoveBonusHasEnded = (context) => {
  return context.countdownToRemoveBonus === 0
}

export const shouldBlink = (context) => {
  return context.blinkingCountdown > 0
}

export const bonusNotExists = (context) => context.bonus === null

export const bonusExists = (context) => Boolean(context.bonus)
