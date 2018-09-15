import OrderBook from '../routines/orderBook'
import AnalyserHelpers from '../../utils/analyserHelpers'
import Transaction from '../../services/Transaction'

export default class SellAnalyser {
  MARGIN_LIMIT = 3
  MIN_PROFIT = 0
  MIN_PRICE = 0
  MARGIN_FIXED_SELL = 3

  constructor(robot, user) {
    this.robot = robot
    this.user = user
    this.pair = robot.pair
    this.MIN_PRICE = robot.minPrice
    this.MIN_PROFIT = robot.minProfit
    this.MARGIN_LIMIT = robot.marginLimit || 3
    this.MARGIN_FIXED_SELL = robot.marginFixedSell
  }

  treatSell = async (sellOrder, smartPrice) => {
    const user = this.user
    const robot = this.robot
    const orderBook = OrderBook.orderBook[sellOrder.pair]
    const coinObj = AnalyserHelpers.getCompleteObject(orderBook)
    const lb = parseFloat(coinObj.lastBid)
    const la = parseFloat(coinObj.lastAsk)
    const profitToAsk = AnalyserHelpers.getProfit(smartPrice, la)
    const profitToBid = AnalyserHelpers.getProfit(smartPrice, lb)
    const profitFixedToAsk = AnalyserHelpers.getProfit(robot.fixedSellPrice, la)
    const sellOrderRate = parseFloat(sellOrder.rate)

    if (robot.keepSelling) {
      await this.moveToLast(sellOrder, lb, la)
      return
    }

    if (lb < this.MIN_PRICE) {
      if (robot.immediate) {
        await this.moveImmediate(sellOrder, lb)
      } else {
        await this.moveToLast(sellOrder, lb, la)
      }
      return
    }

    if (profitToAsk >= this.MIN_PROFIT && coinObj.margin >= this.MARGIN_LIMIT) {
      await this.moveToLast(sellOrder, lb, la)
    } else if (profitToBid >= this.MIN_PROFIT && coinObj.sumBids < coinObj.sumAsks) {
      await this.moveImmediate(sellOrder, lb)
    } else if (robot.fixedSellPrice) {
      if (profitFixedToAsk > (-1 * this.MARGIN_FIXED_SELL)) {
        await Transaction.cancel({ orderNumber: sellOrder.orderNumber, user })
      } else if (sellOrderRate !== robot.fixedSellPrice) {
        const sellP = this.getSellPrice(orderBook.asks)
        const lastAskPrice = orderBook.asks.pop()[0]
        if (sellP && sellOrderRate !== sellP) {
          await this.moveToLast(sellOrder, lb, sellP)
        } else if (lastAskPrice < robot.fixedSellPrice) {
          await this.moveToLast(sellOrder, lb, robot.fixedSellPrice)
        }
      }
    } else {
      await Transaction.cancel({ orderNumber: sellOrder.orderNumber, user })
    }
  }

  threatCoinAvailable = async (coinName, smartPrice, amount) => {
    const user = this.user
    const robot = this.robot
    const orderBook = OrderBook.orderBook[`${this.MAIN_COIN}_${coinName}`]
    const coinObj = AnalyserHelpers.getCompleteObject(orderBook)
    const lb = parseFloat(coinObj.lastBid)
    const la = parseFloat(coinObj.lastAsk)
    const profitToAsk = AnalyserHelpers.getProfit(smartPrice, la)
    const profitToBid = AnalyserHelpers.getProfit(smartPrice, lb)
    const profitFixedToAsk = AnalyserHelpers.getProfit(robot.fixedSellPrice, la)
    const pair = `${this.MAIN_COIN}_${coinName}`

    if (robot.keepSelling) {
      await this.sellToLast(pair, amount, lb, la)
      return
    }

    if (lb < this.MIN_PRICE) {
      if (robot.immediate) {
        await Transaction.sellImmediate({ pair, amount, price: lb, user })
      } else {
        await this.sellToLast(pair, amount, lb, la)
      }
    }

    if (profitToAsk >= this.MIN_PROFIT && coinObj.margin >= this.MARGIN_LIMIT) {
      await this.sellToLast(pair, amount, lb, la)
    } else if (profitToBid >= this.MIN_PROFIT && coinObj.sumBids < coinObj.sumAsks) {
      await Transaction.sellImmediate({ pair, amount, price: lb, user })
    } else if (robot.fixedSellPrice) {
      if (profitFixedToAsk < (-1 * this.MARGIN_FIXED_SELL)) {
        const sellP = this.getSellPrice(orderBook.asks)
        const lastAskPrice = orderBook.asks.pop()[0]
        if (sellP) {
          await this.sellToLast(amount, lb, sellP)
        } else if (lastAskPrice < robot.fixedSellPrice) {
          await this.sellToLast(amount, lb, robot.fixedSellPrice)
        }
      }
    }
  }

  getSellPrice = (asks) => {
    const robot = this.robot
    for (var i = 0; i < asks.length; i++) {
      if (asks[i][0] > robot.fixedSellPrice && asks[i][0] * asks[i][1] > robot.sellHead) {
        return asks[i][0]
      }
    }
    if (asks[0][0] <= robot.fixedSellPrice) {
      return robot.fixedSellPrice
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
    if (sellOrder.rate !== la && sellOrder.rate !== laMinusOne) {
      if (laMinusOne === lb) {
        await this.moveImmediate(sellOrder, lb)
      } else {
        let price = laMinusOne
        if (sellOrder.includes('BCN') || sellOrder.coinName.includes('DOGE')) {
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
