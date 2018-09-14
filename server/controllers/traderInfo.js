import PoloService from '../services/Polo'
import Helpers from '../utils/helpers'

export default {
  tradeHistory: ({ query: { start, end, pair }, user }, res, next) => {
    PoloService.fetchTradeHistory(start, end, user, pair)
      .then((result) => (res.json(result)))
      .catch(error => next(error))
  },
  coinsAvailable: (req, res, next) => {
    PoloService.returnCompleteBalances(req.user)
      .then(balances => res.json(Helpers.filterAvailableCoins(balances)))
      .catch(error => next(error))
  },
  openOrders: (req, res, next) => {
    PoloService.fetchOpenOrders(req.user).then(openOrders => {
      res.json(Helpers.filterBuyAndSellOrders(openOrders))
    }).catch(error => next(error))
  },
}
