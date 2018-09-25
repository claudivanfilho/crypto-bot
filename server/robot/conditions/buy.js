/**
 * The arguments that are passed to each condition are:
 * { args: { openOrders, coinsAvailable, btcAvailable, robots, tradeHistory }, item }
 * item arg is the element in the collection arg of the doActionToEach function in the services/robot
 */

import _ from 'lodash'
import {
  getOrdersWithSamePair,
  calculateMargin,
  findRobot,
  getBtcAvailableToBuyOfRobot,
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
  isBuyImmediate,
  lastBidBiggerThanUpperBreakpointInBuy,
  lastBidSmallerThanLowerBreakpointInBuy,
  hasAskAmountToStop,
  hasBidAmountToActive,
  hasBtcAvailableToBuyOfRobot,
}

export const nestedBuyNumOfOrdersNotMatch = ({
  args: { robots, openOrders: { buy: buyOrders } }, item,
}) => {
  const robot = findRobot(robots, item)
  const coinOrders = getOrdersWithSamePair(item.pair, buyOrders)
  return coinOrders.length !== robot.nestedBuy.numberOfOrders
}
export const isNestedBuyActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  return robot.nestedBuy && robot.nestedBuy.active
}

export const nestedBuyBidMarginExceedsLimits = ({
  args: { robots, orderBookAll, openOrders: { buy: buyOrders } }, item,
}) => {
  const robot = findRobot(robots, item)
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
  return !robot.paused && robot.buy.active
}

export const hasMoreThanOneBuyOrderWithSamePair = ({
  args: { openOrders: { buy: buyOrders } }, item,
}) => (
  getOrdersWithSamePair(item.pair, buyOrders).length > 1
)

export const isCoveringBidActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  return robot.buy.coveringBid
}

export const lastBidSmallerThanBuyBreakpointInBuy = (
  { args: { robots, orderBookAll }, item }
) => {
  const robot = findRobot(robots, item)
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  return lastPriceBid < robot.buy.lowerBreakpointPrice
}

export const isBuyImmediate = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  return robot.buy.immediate
}

export const lastBidBiggerThanUpperBreakpointInBuy = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  return lastPriceBid >= robot.buy.upperBreakpointPrice
}

export const lastBidSmallerThanLowerBreakpointInBuy = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  return lastPriceBid < robot.buy.lowerBreakpointPrice
}

export const hasAskAmountToStop = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  const usefulData = getUsefulData(orderBookAll[robot.pair])
  return usefulData.maxAsk >= robot.buy.askAmountToStop
}

export const hasBidAmountToActive = ({
  args: { robots, orderBookAll }, item,
}) => {
  const robot = findRobot(robots, item)
  return findBiggerThan(
    orderBookAll[robot.pair].bids, robot.buy.bidAmountToActive
  )
}

export const hasBtcAvailableToBuyOfRobot = ({
  args: { orderBookAll, openOrders, btcAvailable, coinsAvailable }, item,
}) => {
  return !!getBtcAvailableToBuyOfRobot(
    openOrders, coinsAvailable, item.pair, item.buy.btcValue, btcAvailable, orderBookAll
  )
}
