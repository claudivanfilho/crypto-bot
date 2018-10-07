export const getSmartPriceOfBuy = (tradeHistory) => {
  var amountCoin = 0
  var amountBTC = 0
  const orders = getBuyOrdersInSequence(tradeHistory)
  orders.map((order) => {
    var btcAtThisPrice = order.rate * order.amount
    amountCoin += order.amount - 0
    amountBTC += btcAtThisPrice - 0
    return 0
  })
  if (amountCoin === 0 && amountBTC === 0) return 0
  return amountBTC / amountCoin
}

export const getProfit = (tradeHistory, price) => {
  const smartPrice = getSmartPriceOfBuy(tradeHistory)
  if (price > smartPrice) {
    return calculateMargin(price, smartPrice)
  }
  var m = calculateMargin(smartPrice + (smartPrice - price), smartPrice)
  return m * -1
}

function getBuyOrdersInSequence(tradeHistory) {
  const orders = []
  let foundBuy = false
  for (var i = 0; i < tradeHistory.length; i++) {
    var order = tradeHistory[i]
    if (order.type === 'buy') {
      orders.push(order)
      foundBuy = true
    }
    if (foundBuy && order.type === 'sell') {
      break
    }
  }
  return orders
}

export const calculateMargin = (ask, bid) => ((ask - bid) * 100 / bid)
