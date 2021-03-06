import {
  findRobot,
} from '../../utils/generalHelpers'

export default {
  isValidAmount,
}

export const isValidAmount = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  const pair = robot.pair || item.pair
  if (!pair) return false
  const lastBidPrice = orderBookAll[pair].bids[0][0]
  return item.available * lastBidPrice > 0.0001
}
