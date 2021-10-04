import { createMachine } from 'xstate'
import { FoodContext } from './foodTypes'

const foodMachine = createMachine<FoodContext>({
  id: 'food',
  context: {
    x: 0,
    y: 0,
  },
})

export default foodMachine
