import Strategy from './strategy'
import OrderBook from './routines/orderBook'

const INTERVAL_STRATEGY = 500 // milliseconds

const user = {
  poloniex: {
    key: process.env.ROBOT_POLONIEX_API_KEY,
    secret: process.env.ROBOT_POLONIEX_API_SECRET,
  },
}

export default {
  init: () => {
    OrderBook.init()
    initStrategy()
  },
}

const initStrategy = () => {
  if (!OrderBook.orderBook) {
    setTimeout(() => {
      initStrategy()
    }, 1000)
  } else {
    const strategy = new Strategy(user, process.env.NODE_ENV)
    strategy.init(INTERVAL_STRATEGY)
  }
}
