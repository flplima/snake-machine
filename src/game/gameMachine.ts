import { createMachine } from 'xstate'

import { GameContext } from './gameTypes'
import * as gameGuards from './gameGuards'
import * as gameActions from './gameActions'

const gameMachine = createMachine<GameContext>(
  {
    id: 'game',
    initial: 'idle',
    context: {
      snake: null,
      food: null,
      bonus: null,
      keystrokes: [],
      countdownToBonus: 5,
      countdownToRemoveBonus: 20,
      speed: 9,
      score: 0,
    },
    states: {
      idle: {
        on: {
          PLAY: 'playing',
        },
      },
      playing: {
        entry: ['resetGameData', 'spawnSnake', 'spawnFood'],
        initial: 'ticking',
        states: {
          waitingTick: {
            after: {
              TICK_DELAY: 'ticking',
            },
          },
          ticking: {
            onDone: {
              target: 'waitingTick',
              actions: ['removeKeystroke', 'drawGame'],
            },
            initial: 'checkingThatWillDie',
            states: {
              checkingThatWillDie: {
                always: [
                  { cond: 'willDie', target: '#game.gameOver' },
                  { cond: 'willCrash', target: 'crashing' },
                  { target: 'checkingBonus' },
                ],
              },
              checkingBonus: {
                always: [
                  {
                    cond: 'willEatBonus',
                    target: 'updatingSnakePosition',
                    actions: [
                      'tellSnakeToEatBonus',
                      'updateScoreWithBonus',
                      'resetBonus',
                    ],
                  },
                  {
                    cond: 'countdownToRemoveBonusHasEnded',
                    target: 'checkingFood',
                    actions: 'resetBonus',
                  },
                  {
                    cond: 'bonusExists',
                    target: 'checkingFood',
                    actions: 'decreaseCountdownToRemoveBonus',
                  },
                  {
                    target: 'checkingFood',
                  },
                ],
              },
              checkingFood: {
                always: [
                  {
                    cond: 'willEatFood',
                    target: 'afterEatFood',
                    actions: [
                      'tellSnakeToEatFood',
                      'updateScoreWithFood',
                      'spawnFood',
                    ],
                  },
                  {
                    target: 'updatingSnakePosition',
                  },
                ],
              },
              afterEatFood: {
                always: [
                  {
                    cond: 'isTimeForBonus',
                    actions: 'spawnBonus',
                    target: 'updatingSnakePosition',
                  },
                  {
                    cond: 'bonusNotExists',
                    actions: 'decreaseCountdownToBonus',
                    target: 'updatingSnakePosition',
                  },
                  { target: 'updatingSnakePosition' },
                ],
              },
              updatingSnakePosition: {
                entry: 'updateSnakePosition',
                type: 'final',
              },
              crashing: {
                entry: 'tellSnakeToCrash',
                type: 'final',
              },
            },
          },
        },
        onDone: 'idle',
        on: {
          KEY_PRESS: { actions: 'registerKeystroke', cond: 'isValidKey' },
          DECREASE_SPEED: {
            actions: 'decreaseSpeed',
          },
          INCREASE_SPEED: {
            actions: 'increaseSpeed',
          },
        },
      },
      gameOver: {
        initial: 'renderWithSnake',
        after: {
          GAME_OVER_DELAY: 'playing',
        },
        states: {
          renderWithSnake: {
            entry: 'drawGame',
            after: {
              BLINK_DELAY: 'renderWithoutSnake',
            },
          },
          renderWithoutSnake: {
            entry: 'drawGameWithoutSnake',
            after: {
              BLINK_DELAY: 'renderWithSnake',
            },
          },
        },
      },
    },
  },
  {
    guards: gameGuards,
    actions: gameActions,
    delays: {
      TICK_DELAY: (context) => 750 / context.speed,
      GAME_OVER_DELAY: 3000,
      BLINK_DELAY: 300,
    },
  }
)

export default gameMachine
