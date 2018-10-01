import {
  getOrdersWithSamePair,
  findRobot,
  getAmountCoin,
  getAmountAvailableToBuyOfRobot,
} from '../../utils/generalHelpers'
import Transaction from '../../services/Transaction'
import { findBiggerThan } from '../../utils/orderBookHelpers'

export default {
  cancelBuyOrdersWithSamePair,
  moveBuyToLast,
  moveBuyImmediate,
  buyToLast,
  buyImmediate,
  buyToCoverBidAmount,
  moveToCoverBidAmount,
  doNestedBuyOrders,
}

export const cancelBuyOrdersWithSamePair = async ({
  args: { user, openOrders: { buy: buyOrders } }, item,
}) => (
  Transaction.cancelOrders(getOrdersWithSamePair(item.pair, buyOrders), user)
)

export const moveBuyToLast = async ({
  args: { user, orderBookAll, robots }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  const orderRate = parseFloat(item.rate)
  const lastBidPlusOne = lastBidPrice + 0.00000001
  if (orderRate !== lastBidPrice &&
    lastBidPlusOne !== orderRate &&
    lastAskPrice !== lastBidPlusOne
  ) {
    const amount = getAmountCoin(item.total, lastBidPlusOne)
    await Transaction.move({
      orderNumber: item.orderNumber,
      amount,
      price: lastBidPlusOne,
      user,
    })
  }
}

export const moveBuyImmediate = async ({
  args: { user, orderBookAll, robots }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const amount = getAmountCoin(item.total, lastBidPrice)
  await Transaction.moveImmediate({
    orderNumber: item.orderNumber,
    amount,
    price: lastBidPrice,
    user,
  })
}

export const buyToLast = async ({
  args: { user, orderBookAll, robots, openOrders, coinsAvailable, amountAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const lastBidPlusOne = lastBidPrice + 0.00000001
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  const amountToBuy = getAmountAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.buy.amount, amountAvailable, orderBookAll
  )
  if (amountToBuy > 0.0001 && lastAskPrice !== lastBidPlusOne) {
    const amount = getAmountCoin(amountToBuy, lastBidPlusOne)
    await Transaction.buy(
      {
        pair: robot.pair,
        amount,
        price: lastBidPlusOne,
        user,
      }
    )
  }
}

export const buyImmediate = async ({
  args: { user, orderBookAll, robots, openOrders, coinsAvailable, amountAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  const amountToBuy = getAmountAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.buy.amount, amountAvailable, orderBookAll
  )
  if (amountToBuy > 0.0001) {
    const amount = getAmountCoin(amountToBuy, lastAskPrice)
    await Transaction.buyImmediate({
      pair: robot.pair,
      amount,
      price: lastAskPrice,
      user,
    })
  }
}

export const buyToCoverBidAmount = async ({
  args: { user, orderBookAll, robots, openOrders, coinsAvailable, amountAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const { price: priceToCover } = findBiggerThan(
    orderBookAll[robot.pair].bids, robot.buy.bidAmountToCover
  ) || {}
  if (priceToCover) {
    const priceToCoverPlusOne = priceToCover + 0.00000001
    const amountToBuy = getAmountAvailableToBuyOfRobot(
      openOrders, coinsAvailable, robot.pair, robot.buy.amount, amountAvailable, orderBookAll
    )
    if (amountToBuy > 0.0001) {
      const amount = getAmountCoin(amountToBuy, priceToCoverPlusOne)
      await Transaction.buy({
        pair: robot.pair,
        amount,
        price: priceToCoverPlusOne,
        user,
      })
    }
  }
}

export const moveToCoverBidAmount = async ({
  args: { user, orderBookAll, robots }, item,
}) => {
  const robot = findRobot(robots, item)
  const { price: priceToCover } = findBiggerThan(
    orderBookAll[robot.pair].bids, robot.buy.bidAmountToCover
  )
  if (priceToCover) {
    const orderRate = parseFloat(item.rate)
    const priceToCoverPlusOne = priceToCover + 0.00000001
    if (orderRate !== priceToCoverPlusOne && priceToCoverPlusOne !== orderRate) {
      const amount = getAmountCoin(item.total, priceToCoverPlusOne)
      await Transaction.move({
        orderNumber: item.orderNumber,
        amount,
        price: priceToCoverPlusOne,
        user,
      })
    }
  }
}

export const doNestedBuyOrders = async ({
  args: { robots, orderBookAll, user, openOrders, coinsAvailable, amountAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const amountToOrder = getAmountAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.nestedBuy.amount, amountAvailable, orderBookAll
  )
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const nestedBuyOrders = getNestedBuyOrders(
    robot.nestedBuy.amount <= amountToOrder ? robot.nestedBuy.amount : amountAvailable,
    robot.nestedBuy.bidMargin,
    lastBidPrice,
    robot.nestedBuy.numberOfOrders,
    robot.nestedBuy.marginOrders,
    robot.nestedBuy.amounts
  )
  for (let j = 0; j < nestedBuyOrders.length; j++) {
    try {
      await Transaction.buy({
        pair: robot.pair,
        amount: nestedBuyOrders[j].amount,
        price: nestedBuyOrders[j].price,
        user,
      })
    // eslint-disable-next-line
    } catch (err) {}
  }
}

const getNestedBuyOrders = (amount, bidMargin, bidPrice, numberOfOrders, marginOrders, amounts) => {
  const orders = []
  const priceMinusMargin = bidPrice - (bidPrice * (bidMargin / 100))
  let acumulatedAmount = 0
  for (var i = 0; i < numberOfOrders; i++) {
    let orderAmount = 0
    if (i === numberOfOrders - 1) {
      orderAmount = amount - acumulatedAmount - 0.00000005
    } else {
      orderAmount = amount * amounts[i]
      acumulatedAmount += orderAmount
    }
    orders.push({
      amount: orderAmount,
      price: priceMinusMargin - (priceMinusMargin * ((marginOrders * i) / 100)),
    })
  }
  return orders
}
