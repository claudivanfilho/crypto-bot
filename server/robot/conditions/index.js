import coinConditions from './coin'
import sellConditions from './sell'
import buyConditions from './buy'

export default {
  ...coinConditions,
  ...sellConditions,
  ...buyConditions,
}
