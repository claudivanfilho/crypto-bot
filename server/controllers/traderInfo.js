import PoloService from '../services/Polo'
import Helpers from '../utils/index'
import {
  tradeHistory,
  coinsAvailable,
  openOrders,
} from '../robot/routines/traderInfo'

export default {
  tradeHistory: ({ query: { start, end, pair }, user }, res, next) => {
    if (tradeHistory) {
      res.json(tradeHistory)
    } else {
      PoloService.fetchTradeHistory(start, end, user, pair)
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
