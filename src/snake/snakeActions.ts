import { assign } from 'xstate'
import { SnakeContext, UpdatePositionEvent } from './snakeTypes'

export const appendBody = assign<SnakeContext, UpdatePositionEvent>({
  body: (context, event) => [event.position, ...context.body],
})

export const registerFoodEaten = assign<SnakeContext, UpdatePositionEvent>({
  body: (context) =>
    context.body.map((item, i) =>
      i === 0 ? { ...item, withFood: true } : item
    ),
})

export const removeLastBody = assign<SnakeContext, UpdatePositionEvent>(
  (context) => ({
    body: context.body.slice(0, -1),
  })
)
