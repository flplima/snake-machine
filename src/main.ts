import { interpret } from 'xstate'

import gameMachine from 'src/game/gameMachine'

const game = interpret(gameMachine)

window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()

    const key = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }[event.key]

    game.send('KEY_PRESS', { key })
  }
})

game.start()
game.send('PLAY')
