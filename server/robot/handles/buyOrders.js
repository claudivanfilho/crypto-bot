import _ from 'lodash'

import OrderBook from '../routines/orderBook'
import BuyAnalyser from '../analysers/sell'
import Transaction from '../../services/Transaction'
import {
  hasMoreThanOne,
  getOrdersWithSamePair,
  calculateMargin,
} from '../../utils/helpers'
import RobotHelpers from '../../utils/robotHelpers'

export default {
  treatBuyOrders: async (buyOrders, robots, user) => {
    for (var i = 0; i < buyOrders.length; i++) {
      const buyOrder = buyOrders[i]
      const robot = robots.filter(r => r.pair === buyOrder.pair).pop()
      if (RobotHelpers.isNestedBuy(robot)) {
        const didTransaction = await applyNestedBuy(buyOrders, robot, buyOrder, user)
        if (didTransaction) return
      } else if (RobotHelpers.isBuyActive(robot)) {
        if (hasMoreThanOne(buyOrder.pair, buyOrders)) {
          await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user })
        } else {
          const analyser = new BuyAnalyser(robot, user)
          await analyser.treatBuyOrder(buyOrder)
        }
      }
    }
  },
}

const applyNestedBuy = async (buyOrders, robot, buyOrder, user) => {
  const lastPriceBid = OrderBook.orderBook[robot.pair].bids[0][0]
  let coinOrders = getOrdersWithSamePair(buyOrder.pair, buyOrders)
  if (coinOrders.length !== robot.nestedBuy.numberOfOrders) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  coinOrders = _.orderBy(coinOrders, ['rate'], ['desc'])
  const firstOrder = coinOrders[0]
  const margin = calculateMargin(firstOrder.rate, lastPriceBid)
  if (margin * -1 < robot.nestedBuy.bidMargin - 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  } else if (margin * -1 > robot.nestedBuy.bidMargin + 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  return false
}
