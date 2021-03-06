import {
  findRobot,
  getOrdersWithSamePair,
} from '../../utils/generalHelpers'
import Transaction from '../../services/Transaction'
import { findBiggerThan } from '../../utils/orderBookHelpers'

export default {
  cancelSellOrdersWithSamePair,
  cancelOrder,
  moveSellToLast,
  moveSellImmediate,
  sellToLast,
  sellImmediate,
  sellToCoverAskAmount,
  moveToCoverAskAmount,
  doNestedSellOrders,
}

export const cancelSellOrdersWithSamePair = async ({
  args: { user, openOrders: { sell: sellOrders } }, item,
}) => (
  Transaction.cancelOrders(getOrdersWithSamePair(item.pair, sellOrders), user)
)

export const cancelOrder = async ({ args: { user }, item: { orderNumber } }) => (
  Transaction.cancel({ orderNumber, user })
)

export const moveSellToLast = async ({
  args: { orderBookAll, robots, user }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const laMinusOne = lastAskPrice - 0.00000001
  const sellRate = parseFloat(item.rate)
  if (sellRate !== lastAskPrice && sellRate !== laMinusOne) {
    if (laMinusOne === lastBidPrice) {
      await moveSellImmediate(item, lastBidPrice)
    } else {
      let price = laMinusOne
      if (item.pair.includes('BCN') || item.pair.includes('DOGE')) {
        price = lastBidPrice
      }
      await Transaction.move({
        orderNumber: item.orderNumber,
        amount: item.amount,
        price,
        user,
      })
    }
  }
}

export const moveSellImmediate = async ({
  args: { user, orderBookAll }, item,
}) => {
  const lastBidPrice = parseFloat(orderBookAll[item.pair].bids[0][0])
  return Transaction.moveImmediate({
    orderNumber: item.orderNumber,
    amount: item.amount,
    price: lastBidPrice,
    user,
  })
}

export const sellToLast = async ({
  args: { orderBookAll, robots, user }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  await sellToPriceMinusOne(lastAskPrice, robot.pair, item.available, user)
}

const sellToPriceMinusOne = async (price, pair, amount, user) => {
  const priceMinusOne = price - 0.00000001
  return Transaction.sell({ pair, amount, price: priceMinusOne, user })
}

const moveToPriceMinusOne = async (price, { rate, orderNumber, amount }, user) => {
  const priceMinusOne = price - 0.00000001
  if (priceMinusOne === parseFloat(rate)) return
  return Transaction.move({
    orderNumber, amount, price: priceMinusOne, user,
  })
}

export const sellImmediate = async ({
  args: { orderBookAll, robots, user }, item,
}) => {
  const { pair } = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[pair].bids[0][0])
  return Transaction.sellImmediate({
    pair,
    amount: item.available,
    price: lastBidPrice,
    user,
  })
}

export const sellToCoverAskAmount = async ({
  args: { orderBookAll, robots, user }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const { price: priceToCover } = findBiggerThan(
    orderBookAll[robot.pair].asks, robot.sell.askAmountToCover, item.rate
  ) || {}
  if (priceToCover) {
    await sellToPriceMinusOne(priceToCover, lastBidPrice, robot.pair, item.available, user)
  }
}

export const moveToCoverAskAmount = async ({
  args: { orderBookAll, robots, user }, item,
}) => {
  const robot = findRobot(robots, item)
  const { price: priceToCover } = findBiggerThan(
    orderBookAll[robot.pair].asks, robot.sell.askAmountToCover, item.rate
  )
  if (priceToCover) {
    await moveToPriceMinusOne(priceToCover, item, user)
  }
}

export const doNestedSellOrders = async ({
  args: { robots, orderBookAll, user }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  const nestedSellOrders = getNestedSellOrders(
    item.available,
    robot.nestedSell.askMargin,
    lastAskPrice,
    robot.nestedSell.numberOfOrders,
    robot.nestedSell.marginOrders,
    robot.nestedSell.amounts
  )
  for (let j = 0; j < nestedSellOrders.length; j++) {
    try {
      await Transaction.sell({
        pair: robot.pair,
        amount: nestedSellOrders[j].amount,
        price: nestedSellOrders[j].price,
        user,
      })
    // eslint-disable-next-line
    } catch (err) { }
  }
  return true
}

const getNestedSellOrders = (amountTotal, askMargin, askPrice, numberOfOrders, marginOrders, amounts) => {
  const orders = []
  const pricePlusMargin = parseFloat(askPrice) + (askPrice * (askMargin / 100))
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
