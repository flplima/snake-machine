import { createMachine } from 'xstate'
import { FoodContext } from 'src/types'

const foodMachine = createMachine<FoodContext>({
  id: 'food',
  context: {
    x: 0,
    y: 0,
  },
})

export default foodMachine
