import { createMachine } from 'xstate'
import { BonusContext } from './bonusTypes'

const bonusMachine = createMachine<BonusContext>({
  id: 'bonus',
  context: {
    x: 0,
    y: 0,
    spriteIndex: 0,
  },
})

export default bonusMachine
