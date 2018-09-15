import _ from 'lodash'

import OrderBook from '../routines/orderBook'
import SellAnalyser from '../analysers/sell'
import Transaction from '../../services/Transaction'
import Helpers from '../../utils/helpers'

export default {
  treatSellOrders: async (sellOrders, tradeHistory, robots, user) => {
    for (var i = 0; i < sellOrders.length; i++) {
      const sellOrder = sellOrders[i]
      const robot = robots.filter(r => r.pair === sellOrder.pair).pop()
      if (robot.watchCeil && robot.watchCeil.active) {
        const didTransaction = await applyWatchCeil(robot, sellOrders, user)
        if (didTransaction) return
      } else if (!robot.paused) {
        if (Helpers.getOrdersOfSameCoin(sellOrder.pair, sellOrders).length > 1) {
          await Transaction.cancel({ orderNumber: sellOrder.orderNumber, user })
        } else {
          const smartPrice = Helpers.getSmartPriceOfBuy(tradeHistory, sellOrder.pair)
          const analyser = new SellAnalyser(robot, user)
          await analyser.treatSell(
            sellOrder,
            smartPrice,
            robot,
            user
          )
        }
      }
    }
  },
}

const applyWatchCeil = async (robot, sellOrders, user) => {
  const lastPriceBid = OrderBook.orderBook[robot.pair].bids[0][0]
  let coinOrders = Helpers.getOrdersOfSameCoin(robot.pair, sellOrders)
  if (coinOrders.length !== robot.watchCeil.numberOfOrders) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  coinOrders = _.orderBy(coinOrders, ['rate'], ['asc'])
  const firstOrder = coinOrders[0]
  const margin = Helpers.calculateMargin(firstOrder.rate, lastPriceBid)
  if (margin < robot.watchCeil.bidMargin - 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  } else if (margin > robot.watchCeil.bidMargin + 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  return false
}
