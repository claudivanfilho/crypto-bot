import Strategy from './strategy'
import OrderBook, { orderBook } from './routines/orderBook'
import TraderInfo, { tradeHistory } from './routines/traderInfo'

const DELAY_STRATEGY = 500 // milliseconds
const DELAY_TRY_INIT_STRATEGY = 1000 // milliseconds

const user = {
  poloniex: {
    key: '',
    secret: '',
  },
}

export default {
  init: (key, secret) => {
    user.poloniex.key = key
    user.poloniex.secret = secret
    OrderBook.init()
    TraderInfo.init(user)
    initStrategy()
  },
}

const initStrategy = () => {
  if (!orderBook || !tradeHistory) {
    setTimeout(() => {
      initStrategy()
    }, DELAY_TRY_INIT_STRATEGY)
  } else {
    console.log('Starting strategy')
    const strategy = new Strategy(user, process.env.NODE_ENV)
    strategy.init(DELAY_STRATEGY)
  }
}
