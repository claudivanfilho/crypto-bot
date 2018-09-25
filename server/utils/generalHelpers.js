export default {
  filterAvailableCoins,
  normalizeOpenOrders,
  getAmountCoin,
  getOrdersWithSamePair,
  getSmartPriceOfBuy,
  getProfit,
  hasMoreThanOne,
  getBTCAvailable,
  hasSellOrder,
  hasBuyOrders,
  calculateMargin,
  fixValue,
  findRobot,
}

/** Return coins that have btcValue greater than 0.001btc. */
export const filterAvailableCoins = (balances) => (
  Object.keys(balances).map(key => ({
    ...balances[key], coinName: key,
  })).filter(coin => coin.btcValue > 0.0001)
)

/** Normalizes the openOrders to an object with the format
 * {
 *   buy: [{...buyorder}, ...],
 *   sell: [{...sellOrder}, ...]
 * }.
 */
export const normalizeOpenOrders = (openOrders) => {
  const buy = filterOrdersByType(openOrders, 'buy')
  const sell = filterOrdersByType(openOrders, 'sell')
  return { buy, sell }
}

/** Amount of coin based on proce and amount of the main coin. */
export const getAmountCoin = (amount, price) => (
  fixValue(parseFloat(amount) / parseFloat(price).toFixed(8))
)

export const getOrdersWithSamePair = (pair, orders) => (
  orders.filter(order => order.pair.toLowerCase() === pair.toLowerCase())
)

export const getSmartPriceOfBuy = (tradeHistory, pair) => {
  var orders = getBuyOrdersInSequence(tradeHistory, pair)
  var amountCoin = 0
  var amountBTC = 0
  orders.map((order) => {
    var btcAtThisPrice = order.rate * order.amount
    amountCoin += order.amount - 0
    amountBTC += btcAtThisPrice - 0
  })
  if (amountCoin === 0 && amountBTC === 0) return 0
  return amountBTC / amountCoin
}

function getBuyOrdersInSequence(tradeHistory, pair) {
  const orders = []
  let foundBuy = false
  if (tradeHistory[pair]) {
    for (var i = 0; i < tradeHistory[pair].length; i++) {
      var order = tradeHistory[pair][i]
      if (order.type === 'buy') {
        orders.push(order)
        foundBuy = true
      }
      if (foundBuy && order.type === 'sell') {
        break
      }
    }
  }
  return orders
}

export const getProfit = (smartPrice, price) => {
  if (price > smartPrice) {
    return calculateMargin(price, smartPrice)
  }
  var m = calculateMargin(smartPrice + (smartPrice - price), smartPrice)
  return m * -1
}

export const hasMoreThanOne = (pair, orders) => (
  getOrdersWithSamePair(pair, orders).length > 1
)

export const getBTCAvailable = (coinsAvailable) => {
  const btc = coinsAvailable.filter(
    coin => coin.coinName === 'BTC'
  ).pop()
  return (btc && btc.available) || 0
}

export const hasSellOrder = (openOrders) => {
  return !!openOrders.sell.length
}

export const hasBuyOrders = (openOrders) => {
  return !!openOrders.buy.length
}

export const calculateMargin = (ask, bid) => ((ask - bid) * 100 / bid)

export const fixValue = (value) => (parseFloat(value.toFixed(8)) + 0)

export const findRobot = (robots, item) => (
  robots.filter(robot =>
    (robot.pair.toLowerCase() === item.pair.toLowerCase()) ||
    (robot.pair.toLowerCase().match(new RegExp(`_${item.coinName}$|${item.coinName}_`))).pop()
  )
)

export const getBtcAvailableToBuyOfRobot = (
  openOrders, coinsAvailable, pair, robotBtcValue, btcAvailable, orderBookAll
) => {
  if (btcAvailable < 0.0001) return 0
  const btcInTransaction = getAmountInTransaction(pair, openOrders, coinsAvailable, orderBookAll)
  if (btcInTransaction >= robotBtcValue) return 0
  const btcAvailableToBuy = robotBtcValue - btcInTransaction
  return Math.min(btcAvailableToBuy, btcAvailable)
}

const getAmountInTransaction = (pair, openOrders, coinsAvailable, orderBookAll) => {
  let sum = 0
  sum += openOrders.buy
    .filter(order => order.pair === pair)
    .reduce((acc, val) => acc + parseFloat(val.total), 0)
  sum += openOrders.sell
    .filter(order => order.pair === pair)
    .reduce((acc, val) => {
      const price = orderBookAll[pair].bids[0][0]
      return acc + parseFloat(val.amount * price)
    }, 0)
  sum += coinsAvailable
    .filter(coin => pair.includes(coin.coinName))
    .reduce((acc, val) => acc + parseFloat(val.btcValue), 0)
  return sum
}

const filterOrdersByType = (openOrders, type) => {
  return Object.keys(openOrders).reduce((acc, key) => {
    const ordersFiltered = openOrders[key].map((order) => (
      { ...order, pair: key }
    )).filter(order => order.type === type)
    return [...acc, ...ordersFiltered]
  }, [])
}

