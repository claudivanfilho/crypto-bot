import _ from 'lodash'

import OrderBook from '../routines/orderBook'
import PoloService from '../../services/Polo'
import SellAnalyser from '../analysers/sell'
import Transaction from '../../services/Transaction'
import Helpers from '../../utils/helpers'

export default {
  treatSellOrders,
}

const hasMoreThanOne = (coinName, orders) => (
  orders.filter(
    order => order.coinName.toLowerCase() === coinName.toLowerCase()
  ).length > 1
)

async function treatSellOrders(sellOrders, tradeHistory, robots, user) {
  for (var i = 0; i < sellOrders.length; i++) {
    const sellOrder = sellOrders[i]
    const robot = robots.filter(r => r.pair === sellOrder.pair).pop()
    if (robot.watchCeil && robot.watchCeil.active) {
      await applyWatchCeil(robot, sellOrders, user)
    } else if (!robot.paused) {
      if (hasMoreThanOne(sellOrder.pair, sellOrders)) {
        await PoloService.cancel({ orderNumber: sellOrder.orderNumber }, user)
      } else {
        const smartPrice = Helpers.getSmartPriceOfBuy(tradeHistory, sellOrder.pair)
        await SellAnalyser.treatSell(
          sellOrder.pair,
          OrderBook[sellOrder.pair],
          smartPrice,
          sellOrder,
          user
        )
      }
    }
  }
}

const getOrdersOfSameCoin = (pair, orders) => (
  orders.filter(order => order.pair === pair)
)

const applyWatchCeil = async (robot, sellOrders, user) => {
  const lastPriceBid = OrderBook[robot.pair].bids[0][0]
  let coinOrders = getOrdersOfSameCoin(robot.pair, sellOrders)
  if (coinOrders.length !== robot.watchCeil.numberOfOrders) {
    await cancelOrders(coinOrders, user)
    return
  }
  coinOrders = _.orderBy(coinOrders, ['rate'], ['asc'])
  const firstOrder = coinOrders[0]
  const margin = Helpers.calculateMargin(firstOrder.rate, lastPriceBid)
  if (margin < robot.watchCeil.bidMargin - 0.5) {
    await cancelOrders(coinOrders, user)
    return
  } else if (margin > robot.watchCeil.bidMargin + 0.5) {
    await cancelOrders(coinOrders, user)
    return
  }
}

const cancelOrders = async (orders, user) => {
  for (let j = 0; j < orders.length; j++) {
    try {
      await Transaction.cancel({ orderNumber: orders[j].orderNumber }, user)
    } catch (err) {}
  }
}
