import OrderBook from '../routines/orderBook'
import TransactionService from '../../services/Transaction'
import BuyAnalyser from '../analysers/buy'
import RobotHelpers from '../../utils/robotHelpers'

export default {
  treatBTCAvailable: async (openOrders, coinsAvailable, btcAvailable, robots, user) => {
    for (let i = 0; i < robots.length; i++) {
      const robot = robots[i]
      if (RobotHelpers.isWatchFloor(robot)) {
        const didTransaction = await applyWatchFloor(robot, btcAvailable, openOrders, coinsAvailable, user)
        if (didTransaction) return
      } else if (RobotHelpers.isBuyActive(robot)) {
        const limit = robot.buyAnalyser.BTC_QUANTITY
        const btcToBuy = getBtcThatCanBuy(openOrders, coinsAvailable, robot.pair, limit, btcAvailable)
        if (btcToBuy && btcToBuy > 0.0001) {
          const analyser = new BuyAnalyser(robot, user)
          const didTransaction = await analyser.treatBTCAvailable(btcToBuy)
          if (didTransaction) return
        }
      }
    }
  },
}

const applyWatchFloor = async (robot, btcAvailable, openOrders, coinsAvailable, user) => {
  const pair = robot.pair
  const bidPrice = OrderBook.orderBook[pair].bids[0][0]
  const validBTC = getBTCToWF(btcAvailable, openOrders, pair, robot.watchFloor.btc, coinsAvailable)
  if (validBTC) {
    const wfOrders = getWFOrders(
      robot.watchFloor.btc <= validBTC ? robot.watchFloor.btc : btcAvailable,
      robot.watchFloor.bidMargin,
      bidPrice,
      robot.watchFloor.numberOfOrders,
      robot.watchFloor.marginOrders,
      robot.watchFloor.amounts
    )
    for (let j = 0; j < wfOrders.length; j++) {
      try {
        await TransactionService.buy(
          pair,
          wfOrders[j].amount,
          wfOrders[j].price,
          user
        )
      // eslint-disable-next-line
      } catch (err) {}
    }
    return true
  }
  return false
}

const getBTCToWF = (btcTotal, orders, pair, btcRobot, coinsAvailable) => {
  const amountCoinInTransaction = getAmountInTransaction(orders, coinsAvailable, pair)
  if (amountCoinInTransaction < btcRobot) {
    var result = btcRobot - amountCoinInTransaction
    if (result > 0.0001) {
      return result <= btcTotal ? result : btcTotal
    }
  }
  return 0
}

const getWFOrders = (btc, bidMargin, bidPrice, numberOfOrders, marginOrders, amounts) => {
  const orders = []
  const priceMinusMargin = bidPrice - (bidPrice * (bidMargin / 100))
  let acumulatedAmount = 0
  for (var i = 0; i < numberOfOrders; i++) {
    let amount = 0
    if (i === numberOfOrders - 1) {
      amount = btc - acumulatedAmount - 0.00000005
    } else {
      amount = btc * amounts[i]
      acumulatedAmount += amount
    }
    orders.push({
      amount,
      price: priceMinusMargin - (priceMinusMargin * ((marginOrders * i) / 100)),
    })
  }
  return orders
}

const getBtcThatCanBuy = (openOrders, coinsAvailable, pair, limit, btcAvailable) => {
  var btc = getAmountInTransaction(openOrders, coinsAvailable, pair)
  if (limit) {
    if (btc >= limit) {
      return 0
    }
    if (limit > btcAvailable) {
      return btcAvailable
    }
    return limit - btc
  }
  return btcAvailable
}

const getAmountInTransaction = (openOrders, coinsAvailable, pair) => {
  let sum = 0
  sum += openOrders.buy.reduce((acc, val) => acc + parseFloat(val.total), 0)
  sum += openOrders.sell.reduce((acc, val) => {
    const price = OrderBook.orderBook[pair].bids[0][0]
    return acc + parseFloat(val.amount * price)
  }, 0)
  sum += coinsAvailable.reduce((acc, val) => acc + parseFloat(val.btcValue), 0)
  return sum
}
