/**
 * The arguments that are passed to each condition are:
 * { args: { openOrders, coinsAvailable, AmountAvailable, robots, tradeHistory }, item }
 * item arg is the element in the collection arg of the doActionToEach function in the services/robot
 */

import _ from 'lodash'
import {
  getOrdersWithSamePair,
  calculateMargin,
  findRobot,
  getAmountAvailableToBuyOfRobot,
} from '../../utils/generalHelpers'
import {
  getUsefulData,
  findBiggerThan,
} from '../../utils/orderBookHelpers'

export default {
  isNestedBuyActive,
  nestedBuyNumOfOrdersNotMatch,
  nestedBuyBidMarginExceedsLimits,
  isBuyActive,
  hasMoreThanOneBuyOrderWithSamePair,
  isCoveringBidActive,
  lastBidBiggerThanUpperBreakpointInBuy,
  lastBidSmallerThanLowerBreakpointInBuy,
  hasAskAmountToStop,
  hasBidAmountToActive,
  hasAmountAvailableToBuyOfRobot,
}

export const nestedBuyNumOfOrdersNotMatch = ({
  args: { robots, openOrders: { buy: buyOrders } }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const coinOrders = getOrdersWithSamePair(item.pair, buyOrders)
  return coinOrders.length !== robot.nestedBuy.numberOfOrders
}
export const isNestedBuyActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return robot.nestedBuy && robot.nestedBuy.active
}

export const nestedBuyBidMarginExceedsLimits = ({
  args: { robots, orderBookAll, openOrders: { buy: buyOrders } }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  let coinOrders = getOrdersWithSamePair(item.pair, buyOrders)
  coinOrders = _.orderBy(coinOrders, ['rate'], ['asc'])
  const firstOrder = coinOrders[0]
  const margin = calculateMargin(firstOrder.rate, lastPriceBid)
  return margin * -1 < robot.nestedBuy.bidMargin - 0.5 ||
    margin * -1 > robot.nestedBuy.bidMargin + 0.5
}

export const isBuyActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return !robot.paused && robot.buy.active
}

export const hasMoreThanOneBuyOrderWithSamePair = ({
  args: { openOrders: { buy: buyOrders } }, item,
}) => (
  getOrdersWithSamePair(item.pair, buyOrders).length > 1
)

export const isCoveringBidActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return robot.buy.coveringBid
}

export const lastBidBiggerThanUpperBreakpointInBuy = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  return lastPriceBid >= robot.buy.upperBreakpointPrice
}

export const lastBidSmallerThanLowerBreakpointInBuy = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  return lastPriceBid < robot.buy.lowerBreakpointPrice
}

export const hasAskAmountToStop = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const usefulData = getUsefulData(orderBookAll[robot.pair])
  return usefulData.maxAsk >= robot.buy.askAmountToStop
}

export const hasBidAmountToActive = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return !!findBiggerThan(
    orderBookAll[robot.pair].bids, robot.buy.bidAmountToActive
  )
}

export const hasAmountAvailableToBuyOfRobot = ({
  args: { robots, orderBookAll, openOrders, amountAvailable, coinsAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return !!getAmountAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.buy.amount, amountAvailable, orderBookAll
  )
}
