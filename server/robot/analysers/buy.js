import OrderBook from '../routines/orderBook'
import AnalyserHelpers from '../../utils/analyserHelpers'
import Transaction from '../../services/Transaction'
import Helpers from '../../utils/helpers'

export default class BuyAnalyser {
  BASE_FLOOR = 0
  BASE_FLOOR_2 = 0
  BASE_MIN_TO_BUY = 0
  BASE_CEIL = 0
  BASE_CEIL_2 = 0
  BLOCK_CEIL = 0
  user = null
  robot = null
  pair = null

  constructor(robot, user) {
    this.robot = robot
    this.user = user
    this.pair = robot.pair
    this.BASE_FLOOR = robot.buyAnalyser.BASE_FLOOR
    this.BASE_FLOOR_2 = robot.buyAnalyser.BASE_FLOOR_2
    this.BASE_MIN_TO_BUY = robot.buyAnalyser.BASE_MIN_TO_BUY
    this.BASE_CEIL = robot.buyAnalyser.BASE_CEIL
    this.BASE_CEIL_2 = robot.buyAnalyser.BASE_CEIL_2
    this.BLOCK_CEIL = robot.buyAnalyser.BLOCK_CEIL
  }

  treatBTCAvailable = async (btc) => {
    const orderBook = OrderBook.orderBook[this.pair]
    const coin = AnalyserHelpers.getCompleteObject(orderBook)
    const baseFloor = AnalyserHelpers.getFirstBTC(orderBook.bids, this.BASE_FLOOR)
    const baseFloor2 = AnalyserHelpers.getFirstBTC(orderBook.bids, this.BASE_FLOOR_2)
    const baseCeil = AnalyserHelpers.getFirstBTC(orderBook.asks, this.BASE_CEIL)
    const baseCeil2 = AnalyserHelpers.getFirstBTC(orderBook.asks, this.BASE_CEIL_2)

    // eslint-disable-next-line
    if (coin.lastBid > this.robot.limitBuyPrice || coin.maxAsk >= this.BLOCK_CEIL) {
      return false
    }

    if (this.robot.keepBuying) {
      await this.buyToLast(btc, coin.lastBid, coin.lastAsk)
      return
    }

    if (coin.lastBid < this.robot.minPrice) return

    if (baseFloor && !baseCeil && !baseCeil2) {
      const price = AnalyserHelpers.getFirstBTC(
        orderBook.bids, this.BASE_MIN_TO_BUY
      ).price
      await this.buyToLast(btc, price, coin.lastAsk)
      return true
    } else if (baseFloor2 && !baseCeil && !baseCeil2 && coin.sumBids > coin.sumAsks) {
      const price = AnalyserHelpers.getFirstBTC(
        orderBook.bids, this.BASE_MIN_TO_BUY
      ).price
      await this.buyToLast(btc, price, coin.lastAsk)
      return true
    } else if (baseFloor) {
      const price = AnalyserHelpers.getFirstBTC(
        orderBook.bids, this.BASE_MIN_TO_BUY
      ).price
      await this.buyToLast(btc, price, coin.lastAsk)
      return true
    }
    return false
  }

  treatBuyOrder = async (buyOrder) => {
    const pair = buyOrder.pair
    const orderBook = OrderBook.orderBook[pair]
    const coin = AnalyserHelpers.getCompleteObject(orderBook)
    const baseFloor = AnalyserHelpers.getFirstBTC(orderBook.bids, this.BASE_FLOOR)
    const baseFloor2 = AnalyserHelpers.getFirstBTC(orderBook.bids, this.BASE_FLOOR_2)
    const baseCeil = AnalyserHelpers.getFirstBTC(orderBook.asks, this.BASE_CEIL)
    const baseCeil2 = AnalyserHelpers.getFirstBTC(orderBook.asks, this.BASE_CEIL_2)

    // eslint-disable-next-line
    if (coin.lastBid > this.robot.limitBuyPrice || coin.maxAsk >= this.BLOCK_CEIL) {
      await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user: this.user })
      return false
    }

    if (this.robot.keepBuying) {
      await this.moveToLast(buyOrder, coin.lastBid, coin.lastAsk)
      return true
    }

    if (coin.lastBid < this.robot.minPrice) {
      await Transaction.cancel({ orderNumber: buyOrder.orderNumber, user: this.user })
      return false
    }

    if (baseFloor && !baseCeil && !baseCeil2) {
      const price = AnalyserHelpers.getFirstBTC(
        orderBook.bids, this.BASE_MIN_TO_BUY, buyOrder.rate
      ).price
      await this.moveToLast(buyOrder, price, coin.lastAsk)
      return true
    } else if (baseFloor2 && !baseCeil && !baseCeil2 && coin.sumBids > coin.sumAsks) {
      const price = AnalyserHelpers.getFirstBTC(
        orderBook.bids, this.BASE_MIN_TO_BUY, buyOrder.rate
      ).price
      await this.moveToLast(buyOrder, price, coin.lastAsk)
      return true
    } else if (baseFloor) {
      const price = AnalyserHelpers.getFirstBTC(
        orderBook.bids, this.BASE_MIN_TO_BUY, buyOrder.rate
      ).price
      await this.moveToLast(buyOrder, price, coin.lastAsk)
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
        const amount = Helpers.getAmountCoin(buyOrder.total, la)
        await Transaction.moveImmediate({
          orderNumber: buyOrder.orderNumber,
          amount,
          price: la,
          user: this.user,
        })
      } else {
        const amount = Helpers.getAmountCoin(buyOrder.total, lbPlusOne)
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
