import { getOrdersWithSamePair, findRobot, getAmountCoin, getBtcAvailableToBuyOfRobot } from '../../utils/generalHelpers'
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

export const cancelBuyOrdersWithSamePair = ({
  args: { user, openOrders: { buy: buyOrders } }, item,
}) => (
  Transaction.cancelOrders(getOrdersWithSamePair(item.pair, buyOrders), user)
)

export const moveBuyToLast = async ({
  args: { user, orderBookAll, robots }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const orderRate = parseFloat(item.rate)
  const lastBidPlusOne = lastBidPrice + 0.00000001
  if (orderRate !== lastBidPrice && lastBidPlusOne !== orderRate) {
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
  args: { user, orderBookAll, robots, openOrders, coinsAvailable, btcAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const lastBidPlusOne = lastBidPrice + 0.00000001
  const btcToBuy = getBtcAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.buy.btcValue, btcAvailable, orderBookAll
  )
  if (btcToBuy > 0.0001) {
    const amount = getAmountCoin(btcToBuy, lastBidPlusOne)
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
  args: { user, orderBookAll, robots, openOrders, coinsAvailable, btcAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const lastAskPrice = parseFloat(orderBookAll[robot.pair].asks[0][0])
  const btcToBuy = getBtcAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.buy.btcValue, btcAvailable, orderBookAll
  )
  if (btcToBuy > 0.0001) {
    const amount = getAmountCoin(btcToBuy, lastAskPrice)
    await Transaction.buyImmediate({
      pair: robot.pair,
      amount,
      price: lastAskPrice,
      user,
    })
  }
}

export const buyToCoverBidAmount = async ({
  args: { user, orderBookAll, robots, openOrders, coinsAvailable, btcAvailable }, item,
}) => {
  const robot = findRobot(robots, item)
  const priceToCover = findBiggerThan(orderBookAll[robot.pair].bids, robot.buy.bidAmountToCover)
  const priceToCoverPlusOne = priceToCover + 0.00000001
  const btcToBuy = getBtcAvailableToBuyOfRobot(
    openOrders, coinsAvailable, robot.pair, robot.buy.btcValue, btcAvailable, orderBookAll
  )
  if (btcToBuy > 0.0001) {
    const amount = getAmountCoin(btcToBuy, priceToCoverPlusOne)
    await Transaction.buy({
      pair: robot.pair,
      amount,
      price: priceToCoverPlusOne,
      user,
    })
  }
}

export const moveToCoverBidAmount = async ({
  args: { user, orderBookAll, robots }, item,
}) => {
  const robot = findRobot(robots, item)
  const priceToCover = findBiggerThan(orderBookAll[robot.pair].bids, robot.buy.bidAmountToCover)
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

export const doNestedBuyOrders = async ({
  args: { robots, orderBookAll, user, openOrders, coinsAvailable, btcAvailable }, item,
}) => {
  const btcToOrder = getBtcAvailableToBuyOfRobot(
    openOrders, coinsAvailable, item.pair, item.buy.btcValue, btcAvailable, orderBookAll
  )
  const lastBidPrice = parseFloat(orderBookAll[robot.pair].bids[0][0])
  const robot = findRobot(robots, item)
  const nestedBuyOrders = getNestedBuyOrders(
    robot.nestedBuy.btc <= btcToOrder ? robot.nestedBuy.btc : btcAvailable,
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

const getNestedBuyOrders = (btc, bidMargin, bidPrice, numberOfOrders, marginOrders, amounts) => {
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
