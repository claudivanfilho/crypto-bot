import OrderBook from '../routines/orderBook'
import OrderBookHelpers from '../../utils/orderBookHelpers'
import Transaction from '../../services/Transaction'
import { getAmountCoin } from '../../utils/helpers'

export default class BuyAnalyser {
  bidAmountToActive = 0
  bidAmountToCover = 0
  askAmountToStop = 0
  upperBreakpointPrice = 0
  lowerBreakpointPrice = 0
  coveringBid = false
  user = null
  robot = null
  pair = null

  constructor(robot, user) {
    this.robot = robot
    this.user = user
    this.pair = robot.pair
    this.upperBreakpointPrice = robot.buy.upperBreakpointPrice
    this.lowerBreakpointPrice = robot.buy.lowerBreakpointPrice
    this.bidAmountToActive = robot.buy.bidAmountToActive
    this.bidAmountToCover = robot.buy.bidAmountToCover
    this.askAmountToStop = robot.buy.askAmountToStop
    this.coveringBid = robot.buy.coveringBid
  }

  treatBTCAvailable = async (btc) => {
    const orderBook = OrderBook.orderBook[this.pair]
    const coinObj = OrderBookHelpers.getUsefulData(orderBook)
    const baseFloor = OrderBookHelpers.findBiggerThan(
      orderBook.bids, this.bidAmountToActive
    )
    const lb = coinObj.lastBid
    const la = coinObj.lastAsk

    // eslint-disable-next-line
    if (lb > this.upperBreakpointPrice || coinObj.maxAsk >= this.askAmountToStop) {
      return false
    }

    if (this.coveringBid) {
      await this.buyToLast(btc, lb, la)
      return true
    }

    if (lb < this.lowerBreakpointPrice) return

    if (baseFloor) {
      const price = OrderBookHelpers.findBiggerThan(
        orderBook.bids, this.bidAmountToCover
      ).price
      await this.buyToLast(btc, price, la)
      return true
    }
    return false
  }

  treatBuyOrder = async (buyOrder) => {
    const pair = buyOrder.pair
    const orderBook = OrderBook.orderBook[pair]
    const coinObj = OrderBookHelpers.getUsefulData(orderBook)
    const lb = coinObj.lastBid
    const la = coinObj.lastAsk
    const baseFloor = OrderBookHelpers.findBiggerThan(orderBook.bids, this.bidAmountToActive)

    // eslint-disable-next-line
    if (lb > this.upperBreakpointPrice || coinObj.maxAsk >= this.askAmountToStop) {
      await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user: this.user })
      return false
    }

    if (this.coveringBid) {
      await this.moveToLast(buyOrder, lb, la)
      return true
    }

    if (lb < this.lowerBreakpointPrice) {
      await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user: this.user })
      return false
    }

    if (baseFloor) {
      const price = OrderBookHelpers.findBiggerThan(
        orderBook.bids, this.bidAmountToCover, buyOrder.rate
      ).price
      await this.moveToLast(buyOrder, price, la)
      return true
    }

    await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user: this.user })
    return true
  }

  buyToLast = async (amount, lastBid, lastAsk) => {
    const lb = parseFloat(lastBid)
    const la = parseFloat(lastAsk)
    const lbPlusOne = lb + 0.00000001
    if (lbPlusOne === la) {
      await Transaction.buyImmediate(
        { pair: this.pair, amount, price: la, user: this.user }
      )
    } else {
      await Transaction.buy(
        { pair: this.pair, amount, price: lbPlusOne, user: this.user }
      )
    }
  }

  moveToLast = async (buyOrder, lastBid, lastAsk) => {
    const lb = parseFloat(lastBid)
    const la = parseFloat(lastAsk)
    const op = parseFloat(buyOrder.rate)
    if (op !== lb && (lb + 0.00000001) !== op) {
      const lbPlusOne = lb + 0.00000001
      if (lbPlusOne === la) {
        const amount = getAmountCoin(buyOrder.total, la)
        await Transaction.moveImmediate({
          orderNumber: buyOrder.orderNumber,
          amount,
          price: la,
          user: this.user,
        })
      } else {
        const amount = getAmountCoin(buyOrder.total, lbPlusOne)
        await Transaction.move({
          orderNumber: buyOrder.orderNumber,
          amount,
          price: lbPlusOne,
          user: this.user,
        })
      }
    }
  }
}
