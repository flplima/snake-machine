import * as drawingMaps from 'src/drawingMaps'
import { SnakeContext } from 'src/types'
import {
  SCALE_FACTOR,
  GAME_HEIGHT,
  GAME_WIDTH,
  BG_COLOR,
  FG_COLOR,
  GRID_ITEM_SIZE,
  SCREEN_PADDING,
} from 'src/constants'

interface Props {
  snake?: SnakeContext
  food: any
  bonus?: any
  score: number
  countdownToRemoveBonus: number
}

export default class Renderer {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(private props: Props) {
    this.canvas = document.querySelector('canvas')!
    this.context = this.canvas.getContext('2d')!

    this.canvas.width =
      SCALE_FACTOR * (GAME_WIDTH * GRID_ITEM_SIZE + SCREEN_PADDING * 3 + 2)
    this.canvas.height =
      SCALE_FACTOR *
      (GAME_HEIGHT * GRID_ITEM_SIZE + SCREEN_PADDING * 3 + 8 + SCREEN_PADDING)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.fillStyle = BG_COLOR
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.fillStyle = FG_COLOR

    this.renderHeader()
    this.renderSquare()
    this.renderSnake()
    this.renderFood()
    this.renderBonus()
  }

  renderHeader() {
    this.renderScore()
    this.renderBonusHeader()
    this.context.fillRect(
      SCALE_FACTOR * SCREEN_PADDING,
      SCALE_FACTOR * (SCREEN_PADDING + 7),
      GAME_WIDTH * GRID_ITEM_SIZE * SCALE_FACTOR +
      (GRID_ITEM_SIZE + 4) * SCALE_FACTOR,
      SCALE_FACTOR
    )
  }

  renderSquare() {
    // top
    this.context.fillRect(
      SCALE_FACTOR * SCREEN_PADDING,
      SCALE_FACTOR * (SCREEN_PADDING + 12),
      GAME_WIDTH * GRID_ITEM_SIZE * SCALE_FACTOR +
      (GRID_ITEM_SIZE + 4) * SCALE_FACTOR,
      SCALE_FACTOR
    )
    // bottom
    this.context.fillRect(
      SCALE_FACTOR * SCREEN_PADDING,
      SCALE_FACTOR * (SCREEN_PADDING + 19 + GAME_HEIGHT * GRID_ITEM_SIZE),
      GAME_WIDTH * GRID_ITEM_SIZE * SCALE_FACTOR +
      (GRID_ITEM_SIZE + 4) * SCALE_FACTOR,
      SCALE_FACTOR
    )
    // left
    this.context.fillRect(
      SCALE_FACTOR * SCREEN_PADDING,
      SCALE_FACTOR * (SCREEN_PADDING + 12),
      SCALE_FACTOR,
      GAME_HEIGHT * GRID_ITEM_SIZE * SCALE_FACTOR +
      (GRID_ITEM_SIZE + 4) * SCALE_FACTOR
    )
    // right
    this.context.fillRect(
      SCALE_FACTOR * (SCREEN_PADDING + GAME_WIDTH * GRID_ITEM_SIZE + 7),
      SCALE_FACTOR * (SCREEN_PADDING + 12),
      SCALE_FACTOR,
      GAME_HEIGHT * GRID_ITEM_SIZE * SCALE_FACTOR +
      (GRID_ITEM_SIZE + 4) * SCALE_FACTOR
    )
  }

  renderSnake() {
    this.props.snake?.body.forEach((snakePart, index, arr) => {
      const isHead = index === 0
      const isTail = index === arr.length - 1

      if (isHead) {
        const food = this.props.food
        const bonus = this.props.bonus
        const shouldOpenMouth =
          (snakePart.direction === 'right' &&
            snakePart.y === food.y &&
            snakePart.x + 1 === food.x) ||
          (snakePart.direction === 'left' &&
            snakePart.y === food.y &&
            snakePart.x - 1 === food.x) ||
          (snakePart.direction === 'down' &&
            snakePart.x === food.x &&
            snakePart.y + 1 === food.y) ||
          (snakePart.direction === 'up' &&
            snakePart.x === food.x &&
            snakePart.y - 1 === food.y) ||
          (snakePart.direction === 'right' &&
            snakePart.y === bonus?.y &&
            snakePart.x + 1 === bonus?.x) ||
          (snakePart.direction === 'left' &&
            snakePart.y === bonus?.y &&
            snakePart.x - 1 === bonus?.x + 1) ||
          (snakePart.direction === 'down' &&
            snakePart.x === bonus?.x &&
            snakePart.y + 1 === bonus?.y) ||
          (snakePart.direction === 'up' &&
            snakePart.x === bonus?.x &&
            snakePart.y - 1 === bonus?.y) ||
          (snakePart.direction === 'down' &&
            snakePart.x === bonus?.x + 1 &&
            snakePart.y + 1 === bonus?.y) ||
          (snakePart.direction === 'up' &&
            snakePart.x === bonus?.x + 1 &&
            snakePart.y - 1 === bonus?.y)
        if (shouldOpenMouth) {
          this.renderMap(
            drawingMaps.snake.headWithMouthOpen[snakePart.direction],
            snakePart.x,
            snakePart.y
          )
        } else {
          this.renderMap(
            drawingMaps.snake.head[snakePart.direction],
            snakePart.x,
            snakePart.y
          )
        }
      } else if (isTail) {
        const lastDirection = arr[arr.length - 2].direction
        this.renderMap(
          drawingMaps.snake.tail[lastDirection],
          snakePart.x,
          snakePart.y
        )
      } else {
        const previousPartDirection = arr[index - 1].direction
        const withFood = snakePart.withFood
        if (snakePart.direction !== previousPartDirection) {
          if (
            (snakePart.direction === 'up' &&
              previousPartDirection === 'left') ||
            (snakePart.direction === 'right' &&
              previousPartDirection === 'down')
          ) {
            this.renderMap(
              drawingMaps.snake[
                withFood ? 'bodyTurningWithFood' : 'bodyTurning'
              ].upLeft,
              snakePart.x,
              snakePart.y
            )
          } else if (
            (snakePart.direction === 'up' &&
              previousPartDirection === 'right') ||
            (snakePart.direction === 'left' && previousPartDirection === 'down')
          ) {
            this.renderMap(
              drawingMaps.snake[
                withFood ? 'bodyTurningWithFood' : 'bodyTurning'
              ].upRight,
              snakePart.x,
              snakePart.y
            )
          } else if (
            (snakePart.direction === 'down' &&
              previousPartDirection === 'left') ||
            (snakePart.direction === 'right' && previousPartDirection === 'up')
          ) {
            this.renderMap(
              drawingMaps.snake[
                withFood ? 'bodyTurningWithFood' : 'bodyTurning'
              ].downLeft,
              snakePart.x,
              snakePart.y
            )
          } else if (
            (snakePart.direction === 'down' &&
              previousPartDirection === 'right') ||
            (snakePart.direction === 'left' && previousPartDirection === 'up')
          ) {
            this.renderMap(
              drawingMaps.snake[
                withFood ? 'bodyTurningWithFood' : 'bodyTurning'
              ].downRight,
              snakePart.x,
              snakePart.y
            )
          }
        } else {
          this.renderMap(
            drawingMaps.snake[withFood ? 'bodyWithFood' : 'body'][
            snakePart.direction
            ],
            snakePart.x,
            snakePart.y
          )
        }
      }
    })
  }

  renderFood() {
    const { food } = this.props
    this.renderMap(drawingMaps.food, food.x, food.y)
  }

  renderBonus() {
    const { bonus } = this.props
    if (bonus) {
      this.renderMap(drawingMaps.bonus[bonus.spriteIndex], bonus.x, bonus.y)
    }
  }

  renderScore() {
    const scoreDigits = [...String(this.props.score).padStart(4, '0')]
    scoreDigits.forEach((digit, index) => {
      drawingMaps.numbers[digit].forEach((line, y) => {
        ;[...line].forEach((letter, x) => {
          if (letter !== ' ') {
            this.context.fillRect(
              (SCREEN_PADDING + index * 4) * SCALE_FACTOR + x * SCALE_FACTOR,
              SCREEN_PADDING * SCALE_FACTOR + y * SCALE_FACTOR,
              SCALE_FACTOR,
              SCALE_FACTOR
            )
          }
        })
      })
    })
  }

  renderBonusHeader() {
    const { bonus } = this.props
    if (bonus) {
      drawingMaps.bonus[bonus.spriteIndex].forEach((line, y) => {
        ;[...line].forEach((letter, x) => {
          if (letter !== ' ') {
            this.context.fillRect(
              (GAME_WIDTH * GRID_ITEM_SIZE - 4) * SCALE_FACTOR +
              x * SCALE_FACTOR,
              SCREEN_PADDING * SCALE_FACTOR + 2 + y * SCALE_FACTOR,
              SCALE_FACTOR,
              SCALE_FACTOR
            )
          }
        })
      })
      const bonusDigits = [
        ...String(this.props.countdownToRemoveBonus).padStart(2, '0'),
      ]
      bonusDigits?.forEach((digit, index) => {
        drawingMaps.numbers[digit].forEach((line, y) => {
          ;[...line].forEach((letter, x) => {
            if (letter !== ' ') {
              this.context.fillRect(
                (GAME_WIDTH * GRID_ITEM_SIZE + SCREEN_PADDING + index * 4) *
                SCALE_FACTOR +
                x * SCALE_FACTOR,
                SCREEN_PADDING * SCALE_FACTOR + y * SCALE_FACTOR,
                SCALE_FACTOR,
                SCALE_FACTOR
              )
            }
          })
        })
      })
    }
  }

  renderMap(drawingMap, positionX, positionY) {
    const gameFieldX = (SCREEN_PADDING + 2) * SCALE_FACTOR
    const gameFieldY = (SCREEN_PADDING + 14) * SCALE_FACTOR
    drawingMap.forEach((line, y) => {
      ;[...line].forEach((letter, x) => {
        if (letter !== ' ') {
          this.context.fillRect(
            gameFieldX +
            positionX * SCALE_FACTOR * GRID_ITEM_SIZE +
            x * SCALE_FACTOR,
            gameFieldY +
            positionY * SCALE_FACTOR * GRID_ITEM_SIZE +
            y * SCALE_FACTOR,
            SCALE_FACTOR,
            SCALE_FACTOR
          )
        }
      })
    })
  }
}
