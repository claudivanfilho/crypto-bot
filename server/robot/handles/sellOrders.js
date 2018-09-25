import _ from 'lodash'

import OrderBook from '../routines/orderBook'
import SellAnalyser from '../analysers/sell'
import Transaction from '../../services/Transaction'
import {
  getOrdersWithSamePair,
  calculateMargin,
  getSmartPriceOfBuy,
} from '../../utils/helpers'
import RobotHelpers from '../../utils/robotHelpers'

export default {
  treatSellOrders: async (sellOrders, tradeHistory, robots, user) => {
    for (var i = 0; i < sellOrders.length; i++) {
      const sellOrder = sellOrders[i]
      const robot = robots.filter(r => r.pair === sellOrder.pair).pop()
      if (RobotHelpers.isNestedSell(robot)) {
        const didTransaction = await applyNestedSell(robot, sellOrders, user)
        if (didTransaction) return
      } else if (RobotHelpers.isSellActive(robot)) {
        if (getOrdersWithSamePair(sellOrder.pair, sellOrders).length > 1) {
          await Transaction.cancel({ orderNumber: sellOrder.orderNumber, user })
        } else {
          const smartPrice = getSmartPriceOfBuy(tradeHistory, sellOrder.pair)
          const analyser = new SellAnalyser(robot, user)
          await analyser.treatSellOrder(sellOrder, smartPrice)
        }
      }
    }
  },
}

const applyNestedSell = async (robot, sellOrders, user) => {
  const lastPriceBid = OrderBook.orderBook[robot.pair].bids[0][0]
  let coinOrders = getOrdersWithSamePair(robot.pair, sellOrders)
  if (coinOrders.length !== robot.nestedSell.numberOfOrders) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  coinOrders = _.orderBy(coinOrders, ['rate'], ['asc'])
  const firstOrder = coinOrders[0]
  const margin = calculateMargin(firstOrder.rate, lastPriceBid)
  if (margin < robot.nestedSell.bidMargin - 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  } else if (margin > robot.nestedSell.bidMargin + 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  return false
}
