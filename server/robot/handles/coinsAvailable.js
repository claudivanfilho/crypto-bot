import OrderBook from '../routines/orderBook'
import SellAnalyser from '../analysers/sell'
import Transaction from '../../services/Transaction'
import { getSmartPriceOfBuy } from '../../utils/helpers'
import RobotHelpers from '../../utils/robotHelpers'

export default {
  treatCoinsAvailable: async (coinsAvailable, tradeHistory, robots, user) => {
    // @TODO TREAT BTC_
    for (var i = 0; i < coinsAvailable.length; i++) {
      const coin = coinsAvailable[i]
      const pair = `BTC_${coin.coinName}`
      const smartPrice = getSmartPriceOfBuy(tradeHistory, pair)
      const amount = coin.available
      const robot = robots.filter(r => r.pair === pair).pop()
      const available = coin.available
      if (RobotHelpers.isNestedSell(robot)) {
        const didTransaction = await applyNestedSell(available, pair, robot, user)
        if (didTransaction) return
      } else if (RobotHelpers.isSellActive(robot)) {
        const analyser = new SellAnalyser(robot, user)
        await analyser.treatCoinAvailable(
          smartPrice,
          amount
        )
      }
    }
  },
}

const applyNestedSell = async (available, pair, robot, user) => {
  const bidPrice = OrderBook.orderBook[pair].bids[0][0]
  if (available * bidPrice > 0.0001) {
    const nestedSellOrders = getNestedSellOrders(
      available,
      robot.nestedSell.bidMargin,
      bidPrice,
      robot.nestedSell.numberOfOrders,
      robot.nestedSell.marginOrders,
      robot.nestedSell.amounts)
    for (let j = 0; j < nestedSellOrders.length; j++) {
      try {
        await Transaction.sell({
          pair,
          amount: nestedSellOrders[j].amount,
          price: nestedSellOrders[j].price,
          user,
        })
        // eslint-disable-next-line
      } catch (err) { }
    }
    return true
  }
  return false
}

const getNestedSellOrders = (amountTotal, bidMargin, bidPrice, numberOfOrders, marginOrders, amounts) => {
  const orders = []
  const pricePlusMargin = parseFloat(bidPrice) + (bidPrice * (bidMargin / 100))
  let acumulatedAmount = 0
  for (var i = 0; i < numberOfOrders; i++) {
    let amount = 0
    if (i === numberOfOrders - 1) {
      amount = amountTotal - acumulatedAmount - 0.00000005
    } else {
      amount = amountTotal * amounts[i]
      acumulatedAmount += amount
    }
    orders.push({
      amount,
      price: pricePlusMargin + (pricePlusMargin * ((marginOrders * i) / 100)),
    })
  }
  return orders
}
