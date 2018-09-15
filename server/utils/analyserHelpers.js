import Helpers from './helpers'

export default {
  getCompleteCoin: (pair, orderBook, comparisonArray) => {
    const coinObj = comparisonArray.filter(coin => coin.pair === pair).pop() || {}
    coinObj.lastAsk = orderBook.asks[0][0]
    coinObj.lastAsk2 = orderBook.asks[1][0]
    coinObj.lastBid = orderBook.bids[0][0]
    coinObj.lastBid2 = orderBook.bids[1][0]
    return coinObj
  },
  getCompleteObject: (orderBook, limit) => {
    if (!limit) limit = orderBook.bids.length

    const bids = orderBook.bids
    const asks = orderBook.asks

    const dataBidsAll = getFunctionalData(bids)
    const dataBidsLimit = getFunctionalData(bids, limit)

    const dataAsksAll = getFunctionalData(asks)
    const dataAsksLimit = getFunctionalData(asks, limit)

    const marginMaxBid = Helpers.calculateMargin(bids[0][0], dataBidsAll.priceMax)
    const margin = Helpers.calculateMargin(asks[0][0], bids[0][0])
    const margin1to2 = Helpers.calculateMargin(bids[0][0], bids[1][0])

    return {
      margin,
      margin1to2,
      lastBid: bids[0][0],
      lastAsk: asks[0][0],
      maxAsk: dataAsksAll.max,
      priceMaxAsk: dataAsksAll.priceMax,
      maxAsk2: dataAsksAll.max2,
      sumAsks: dataAsksAll.sum,
      maxBid: dataBidsAll.max,
      maxBid2: dataBidsAll.max2,
      sumBids: dataBidsAll.sum,
      priceMaxBid: dataBidsAll.priceMax,
      limit: {
        maxAsk: dataAsksLimit.max,
        priceMaxAsk: dataAsksLimit.priceMax,
        maxAsk2: dataAsksLimit.max2,
        sumAsks: dataAsksLimit.sum,
        maxBid: dataBidsLimit.max,
        maxBid2: dataBidsLimit.max2,
        sumBids: dataBidsLimit.sum,
        priceMaxBid: dataBidsLimit.priceMax,
      },
      marginMaxBid,
    }
  },
  getProfit,
  getFirstBTC: (orders, btc, excludedPrice, limit) => {
    if (!limit) limit = orders.length
    for (let i = 0; i < orders.length; i++) {
      const btcTotal = orders[i][0] * orders[i][1]
      if (
        btcTotal >= btc &&
        parseFloat(orders[i][0]) !== parseFloat(excludedPrice)) {
        return { value: btcTotal, price: orders[i][0] }
      }
    }
    return null
  },
}

function getProfit(smartPrice, price) {
  if (price > smartPrice) {
    return Helpers.calculateMargin(price, smartPrice)
  }
  const m = Helpers.calculateMargin(smartPrice + (smartPrice - price), smartPrice)
  return m * -1
}

function getFunctionalData(orders, limit) {
  if (!limit) limit = orders.length
  let max = 0
  let max2 = 0
  let priceMax = 0
  let sum = 0
  for (let i = 0; i < limit; i++) {
    const obj = orders[i]
    const btcValue = obj[0] * obj[1]
    if (max < btcValue) {
      max2 = max
      max = btcValue
      priceMax = parseFloat(obj[0])
    } else if (btcValue > max2) {
      max2 = btcValue
    }
    sum += btcValue
  }
  return { max, max2, priceMax, sum }
}
