import _ from 'lodash'

import OrderBook from '../routines/orderBook'
import BuyAnalyser from '../analysers/sell'
import Transaction from '../../services/Transaction'
import Helpers from '../../utils/helpers'
import RobotHelpers from '../../utils/robotHelpers'

export default {
  treatBuyOrders: async (buyOrders, robots, user) => {
    for (var i = 0; i < buyOrders.length; i++) {
      const buyOrder = buyOrders[i]
      const robot = robots.filter(r => r.pair === buyOrder.pair).pop()
      if (RobotHelpers.isWatchFloor(robot)) {
        const didTransaction = await applyWatchFloor(buyOrders, robot, buyOrder, user)
        if (didTransaction) return
      } else if (RobotHelpers.isBuyActive(robot)) {
        if (Helpers.hasMoreThanOne(buyOrder.pair, buyOrders)) {
          await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user })
        } else {
          const analyser = new BuyAnalyser(robot, user)
          await analyser.treatBuyOrder(buyOrder)
        }
      }
    }
  },
}

const applyWatchFloor = async (buyOrders, robot, buyOrder, user) => {
  const lastPriceBid = OrderBook.orderBook[robot.pair].bids[0][0]
  let coinOrders = Helpers.getOrdersOfSameCoin(buyOrder.pair, buyOrders)
  if (coinOrders.length !== robot.watchFloor.numberOfOrders) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  coinOrders = _.orderBy(coinOrders, ['rate'], ['desc'])
  const firstOrder = coinOrders[0]
  const margin = Helpers.calculateMargin(firstOrder.rate, lastPriceBid)
  if (margin * -1 < robot.watchFloor.bidMargin - 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  } else if (margin * -1 > robot.watchFloor.bidMargin + 0.5) {
    await Transaction.cancelOrders(coinOrders, user)
    return true
  }
  return false
}
