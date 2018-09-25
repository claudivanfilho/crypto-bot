import { calculateMargin } from './generalHelpers'

export default {
  getUsefulData,
  findBiggerThan,
}

export const getUsefulData = (orderBook, range) => {
  if (!range) range = orderBook.bids.length

  const bids = orderBook.bids
  const asks = orderBook.asks

  const dataBidsAll = getFunctionalData(bids)
  const dataBidsRange = getFunctionalData(bids, range)

  const dataAsksAll = getFunctionalData(asks)
  const dataAsksRange = getFunctionalData(asks, range)

  const marginMaxBid = calculateMargin(bids[0][0], dataBidsAll.priceMax)
  const margin = calculateMargin(asks[0][0], bids[0][0])
  const marginLastBids = calculateMargin(bids[0][0], bids[1][0])

  return {
    margin,
    marginLastBids,
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
    range: {
      maxAsk: dataAsksRange.max,
      priceMaxAsk: dataAsksRange.priceMax,
      maxAsk2: dataAsksRange.max2,
      sumAsks: dataAsksRange.sum,
      maxBid: dataBidsRange.max,
      maxBid2: dataBidsRange.max2,
      sumBids: dataBidsRange.sum,
      priceMaxBid: dataBidsRange.priceMax,
    },
    marginMaxBid,
  }
}

export const findBiggerThan = (orders, amountToCheck, excludedPrice, limit) => {
  if (!limit) limit = orders.length
  for (let i = 0; i < limit; i++) {
    const price = parseFloat(orders[i][0])
    const amountCoin = parseFloat(orders[i][1])
    const amountTotal = amountCoin * price
    if (
      amountTotal >= amountToCheck &&
      price !== parseFloat(excludedPrice)) {
      return { amount: amountTotal, price }
    }
  }
  return null
}

function getFunctionalData(orders, limit) {
  if (!limit) limit = orders.length
  let max = 0
  let max2 = 0
  let priceMax = 0
  let sum = 0
  for (let i = 0; i < limit; i++) {
    const obj = orders[i]
    const amountTotal = obj[0] * obj[1]
    if (max < amountTotal) {
      max2 = max
      max = amountTotal
      priceMax = parseFloat(obj[0])
    } else if (amountTotal > max2) {
      max2 = amountTotal
    }
    sum += amountTotal
  }
  return { max, max2, priceMax, sum }
}
