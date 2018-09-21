import OrderBook from '../routines/orderBook'
import AnalyserHelpers from '../../utils/analyserHelpers'
import Helpers from '../../utils/helpers'
import Transaction from '../../services/Transaction'

export default class SellAnalyser {
  robot = null
  user = null
  pair = null
  marginLimit = 0
  coveringAsk = false
  fixedPrice = 0
  marginFixedPrice = 0
  askAmountToCover = 0
  immediate = false
  minProfit = 0
  lowerBreakpointPrice = 0

  constructor(robot, user) {
    this.robot = robot
    this.user = user
    this.pair = robot.pair
    this.marginLimit = robot.sell.marginLimit || 3
    this.coveringAsk = robot.sell.coveringAsk
    this.fixedPrice = robot.sell.fixedPrice
    this.marginFixedPrice = robot.sell.marginFixedPrice || 3
    this.askAmountToCover = robot.sell.askAmountToCover
    this.immediate = robot.sell.immediate
    this.minProfit = robot.sell.minProfit
    this.lowerBreakpointPrice = robot.sell.lowerBreakpointPrice
  }

  treatSellOrder = async (sellOrder, smartPrice) => {
    const user = this.user
    const orderBook = OrderBook.orderBook[sellOrder.pair]
    const coinObj = AnalyserHelpers.getCompleteObject(orderBook)
    const lb = parseFloat(coinObj.lastBid)
    const la = parseFloat(coinObj.lastAsk)
    const profitToAsk = Helpers.getProfit(smartPrice, la)
    const profitToBid = Helpers.getProfit(smartPrice, lb)
    const profitFixedToAsk = Helpers.getProfit(la, this.fixedPrice)
    const sellOrderRate = parseFloat(sellOrder.rate)

    if (this.coveringAsk) {
      await this.moveToLast(sellOrder, lb, la)
      return
    }

    if (lb < this.lowerBreakpointPrice) {
      if (this.immediate) {
        await this.moveImmediate(sellOrder, lb)
      } else {
        await this.moveToLast(sellOrder, lb, la)
      }
      return
    }

    if (profitToAsk >= this.minProfit && coinObj.margin >= this.marginLimit) {
      await this.moveToLast(sellOrder, lb, la)
    } else if (profitToBid >= this.minProfit && coinObj.sumBids < coinObj.sumAsks) {
      await this.moveImmediate(sellOrder, lb)
    } else if (this.fixedPrice) {
      if (profitFixedToAsk > 0 && profitFixedToAsk < this.marginFixedPrice) {
        await Transaction.cancel({ orderNumber: sellOrder.orderNumber, user })
      } else if (sellOrderRate !== this.fixedPrice) {
        const sellPrice = this.getSellPrice(orderBook.asks)
        const lastAskPrice = orderBook.asks.pop()[0]
        if (sellPrice && sellOrderRate !== sellPrice) {
          await this.moveToLast(sellOrder, lb, sellPrice)
        } else if (lastAskPrice < this.fixedPrice) {
          await this.moveToLast(sellOrder, lb, this.fixedPrice)
        }
      }
    } else {
      await Transaction.cancel({ orderNumber: sellOrder.orderNumber, user })
    }
  }

  treatCoinAvailable = async (smartPrice, amount) => {
    const user = this.user
    const orderBook = OrderBook.orderBook[this.pair]
    const coinObj = AnalyserHelpers.getCompleteObject(orderBook)
    const lb = parseFloat(coinObj.lastBid)
    const la = parseFloat(coinObj.lastAsk)
    const profitToAsk = Helpers.getProfit(smartPrice, la)
    const profitToBid = Helpers.getProfit(smartPrice, lb)
    const profitFixedToAsk = Helpers.getProfit(this.fixedSellPrice, la)

    if (this.coveringAsk) {
      await this.sellToLast(this.pair, amount, lb, la)
      return
    }

    if (lb < this.lowerBreakpointPrice) {
      if (this.immediate) {
        await Transaction.sellImmediate({ pair: this.pair, amount, price: lb, user })
      } else {
        await this.sellToLast(this.pair, amount, lb, la)
      }
    }

    if (profitToAsk >= this.minProfit && coinObj.margin >= this.marginLimit) {
      await this.sellToLast(this.pair, amount, lb, la)
    } else if (profitToBid >= this.minProfit && coinObj.sumBids < coinObj.sumAsks) {
      await Transaction.sellImmediate({ pair: this.pair, amount, price: lb, user })
    } else if (this.fixedSellPrice) {
      if (profitFixedToAsk < (-1 * this.marginFixedPrice)) {
        const sellP = this.getSellPrice(orderBook.asks)
        const lastAskPrice = orderBook.asks.pop()[0]
        if (sellP) {
          await this.sellToLast(amount, lb, sellP)
        } else if (lastAskPrice < this.fixedSellPrice) {
          await this.sellToLast(amount, lb, this.fixedSellPrice)
        }
      }
    }
  }

  getSellPrice = (asks) => {
    for (var i = 0; i < asks.length; i++) {
      if (
        !(asks[i][0] <= this.fixedSellPrice) &&
        !(asks[i][0] * asks[i][1] <= this.askAmountToCover)
      ) {
        return asks[i][0]
      }
    }
    if (asks[0][0] <= this.fixedSellPrice) {
      return this.fixedSellPrice
    }
    return null
  }

  sellToLast = async (pair, amount, lb, la) => {
    const user = this.user
    const laMinusOne = la - 0.00000001
    if (laMinusOne === lb) {
      await Transaction.sellImmediate({ pair, amount, lb, user })
    } else {
      await Transaction.sell({
        pair,
        amount,
        price: laMinusOne,
        user,
      })
    }
  }

  moveToLast = async (sellOrder, lb, la) => {
    const user = this.user
    const laMinusOne = la - 0.00000001
    const sr = parseFloat(sellOrder.rate)
    if (sr !== la && sr !== laMinusOne) {
      if (laMinusOne === lb) {
        await this.moveImmediate(sellOrder, lb)
      } else {
        let price = laMinusOne
        if (sellOrder.pair.includes('BCN') || sellOrder.pair.includes('DOGE')) {
          price = la
        }
        await Transaction.move({
          orderNumber: sellOrder.orderNumber,
          amount: sellOrder.amount,
          price,
          user,
        })
      }
    }
  }

  moveImmediate = async (sellOrder, price) => {
    await Transaction.moveImmediate({
      orderNumber: sellOrder.orderNumber,
      amount: sellOrder.amount,
      price,
      user: this.user,
    })
  }
}
