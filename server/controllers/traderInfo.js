import PoloService from '../services/Polo'
import Helpers from '../utils/index'
import moment from 'moment'
import {
  tradeHistory,
  coinsAvailable,
  openOrders,
} from '../robot/routines/traderInfo'

export default {
  tradeHistory: ({ query: {
    start = moment().subtract(90, 'day').startOf('day').unix(),
    end = moment().unix(),
    pair = 'All',
  }, user }, res, next) => {
    if (tradeHistory) {
      if (pair !== 'All') {
        res.json(tradeHistory[pair] || [])
      } else {
        res.json(tradeHistory)
      }
    } else {
      PoloService.fetchTradeHistory(pair, start, end, user)
        .then((result) => (res.json(result)))
        .catch(error => next(error))
    }
  },
  coinsAvailable: (req, res, next) => {
    if (coinsAvailable) {
      res.json(coinsAvailable)
    } else {
      PoloService.returnCompleteBalances(req.user)
        .then(balances => res.json(Helpers.filterAvailableCoins(balances)))
        .catch(error => next(error))
    }
  },
  openOrders: (req, res, next) => {
    if (openOrders) {
      res.json(openOrders)
    } else {
      PoloService.fetchOpenOrders(req.user).then(openOrders => {
        res.json(Helpers.normalizeOpenOrders(openOrders))
      }).catch(error => next(error))
    }
  },
}
