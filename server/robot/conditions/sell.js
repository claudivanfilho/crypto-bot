/**
 * The arguments that are passed to each condition are:
 * { args: { openOrders, coinsAvailable, btcAvailable, robots, tradeHistory }, item }
 * item arg is the element in the collection arg of the doActionToEach function in the services/robot
 */

import _ from 'lodash'
import {
  getOrdersWithSamePair,
  calculateMargin,
  getSmartPriceOfBuy,
  findRobot,
  getProfit,
  fixValue,
} from '../../utils/generalHelpers'
import {
  getUsefulData,
  findBiggerThan,
} from '../../utils/orderBookHelpers'

export default {
  isNestedSellActive,
  nestedSellNumOfOrdersNotMatch,
  nestedSellBidMarginExceedsLimits,
  isSellActive,
  hasMoreThanOneSellOrderWithSamePair,
  isCoveringAskActive,
  lastBidSmallerThanLowerBreakpointInSell,
  isSellImmediate,
  profitAskReachesMinProfitUp,
  profitBidReachesMinProfitUp,
  sumAsksBiggerThanSumBids,
  reachesMarginLimitUp,
  hasFixedPrice,
  reachesMarginFixedPriceDown,
  hasAmountToCoverBelowFixedSell,
}

export const nestedSellNumOfOrdersNotMatch = ({
  args: { robots, openOrders: { sell: sellOrders } }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const coinOrders = getOrdersWithSamePair(item.pair, sellOrders)
  return coinOrders.length !== robot.nestedSell.numberOfOrders
}
export const isNestedSellActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return robot.nestedSell && robot.nestedSell.active
}

export const nestedSellBidMarginExceedsLimits = ({
  args: { robots, orderBookAll, openOrders: { sell: sellOrders } }, item,
}) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  let coinOrders = getOrdersWithSamePair(item.pair, sellOrders)
  coinOrders = _.orderBy(coinOrders, ['rate'], ['asc'])
  const firstOrder = coinOrders[0]
  const margin = calculateMargin(firstOrder.rate, lastPriceBid)
  return margin < robot.nestedSell.bidMargin - 0.5 ||
    margin > robot.nestedSell.bidMargin + 0.5
}

export const isSellActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return !robot.paused && robot.sell.active
}

export const hasMoreThanOneSellOrderWithSamePair = ({
  args: { openOrders: { sell: sellOrders } }, item,
}) => (
  getOrdersWithSamePair(item.pair, sellOrders).length > 1
)

export const isCoveringAskActive = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return robot.sell.coveringAsk
}

export const lastBidSmallerThanLowerBreakpointInSell = (
  { args: { robots, orderBookAll }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  return lastPriceBid < robot.sell.lowerBreakpointPrice
}

export const isSellImmediate = ({ args: { robots }, item }) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return robot.sell.immediate
}

export const profitAskReachesMinProfitUp = (
  { args: { robots, orderBookAll, tradeHistory }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceAsk = orderBookAll[robot.pair].asks[0][0]
  const smartPrice = getSmartPriceOfBuy(tradeHistory, robot.pair)
  const profitToAsk = getProfit(smartPrice, lastPriceAsk)
  return fixValue(profitToAsk) >= robot.sell.minProfit
}

export const profitBidReachesMinProfitUp = (
  { args: { robots, orderBookAll, tradeHistory }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceBid = orderBookAll[robot.pair].bids[0][0]
  const smartPrice = getSmartPriceOfBuy(tradeHistory, robot.pair)
  const profitToBid = getProfit(smartPrice, lastPriceBid)
  return fixValue(profitToBid) >= robot.sell.minProfit
}

export const sumAsksBiggerThanSumBids = (
  { args: { robots, orderBookAll }, item }
) => {
  const robot = findRobot(robots, item)
  const pair = robot.pair || item.pair
  if (!pair) return false
  const usefulData = getUsefulData(orderBookAll[pair])
  return usefulData.sumBids < usefulData.sumAsks
}

export const reachesMarginLimitUp = (
  { args: { robots, orderBookAll }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const usefulData = getUsefulData(orderBookAll[robot.pair])
  return usefulData.margin >= robot.sell.marginLimit
}

export const hasFixedPrice = (
  { args: { robots }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  return !!robot.sell.fixedPrice
}

export const reachesMarginFixedPriceDown = (
  { args: { robots, orderBookAll }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const lastPriceAsk = orderBookAll[robot.pair].asks[0][0]
  const profitFixedToAsk = getProfit(lastPriceAsk, robot.sell.fixedPrice)
  return profitFixedToAsk > 0 && profitFixedToAsk < robot.sell.marginFixedPrice
}

export const hasAmountToCoverBelowFixedSell = (
  { args: { robots, orderBookAll }, item }
) => {
  const robot = findRobot(robots, item)
  if (!robot) return false
  const orderFound = findBiggerThan(
    orderBookAll[robot.pair].asks,
    robot.sell.askAmountToCover,
    item.rate
  )
  const sellRate = parseFloat(item.rate)
  const sellRateMinusOne = parseFloat(item.rate) - 0.00000001
  return !!orderFound &&
    orderFound.price <= robot.sell.fixedPrice &&
    orderFound.price !== sellRate &&
    orderFound.price !== sellRateMinusOne
}
