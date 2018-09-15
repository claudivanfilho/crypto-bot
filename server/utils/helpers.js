export default {
  /** Return coins that have btcValue greater than 0.001btc. */
  filterAvailableCoins: (balances) => (
    Object.keys(balances).map(key => ({
      ...balances[key], coinName: key,
    })).filter(coin => coin.btcValue > 0.0001)
  ),

  filterBuyAndSellOrders: (openOrders) => {
    const buy = filterOrdersByType(openOrders, 'buy')
    const sell = filterOrdersByType(openOrders, 'sell')
    return { buy, sell }
  },

  fixValue,

  /** Amount of coin based on proce and amount of the main coin. */
  getAmountCoin: (amount, price) => (
    fixValue(parseFloat(amount) / parseFloat(price).toFixed(8))
  ),

  calculateMargin,

  getSmartPriceOfBuy,

  getProfit,

  getOrdersOfSameCoin: (pair, orders) => (
    orders.filter(order => order.pair.toLowerCase() === pair.toLowerCase())
  ),
}

const calculateMargin = (ask, bid) => ((ask - bid) * 100 / bid)

const getSmartPriceOfBuy = (tradeHistory, pair) => {
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

const getProfit = (smartPrice, price) => {
  if (price > smartPrice) {
    return calculateMargin(price, smartPrice)
  }
  var m = calculateMargin(smartPrice + (smartPrice - price), smartPrice)
  return m * -1
}

const fixValue = (value) => (parseFloat(value.toFixed(8)) + 0)

const filterOrdersByType = (openOrders, type) => (
  Object.keys(openOrders).map(key => ({
    ...openOrders[key], pair: key,
  })).reduce((acc, value) => {
    return [...acc, ...value.filter(order => order.type === type)]
  }, [])
)
