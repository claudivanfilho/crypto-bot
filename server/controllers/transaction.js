import TransactionService from '../services/Transaction'

export default {
  buy: ({ body: { pair, amount, price }, user }, res, next) => {
    TransactionService.buy({ pair, amount, price, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
  buyImmediate: ({ body: { pair, amount, price }, user }, res, next) => {
    TransactionService.buyImmediate({ pair, amount, price, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
  move: ({ body: { orderNumber, amount, price }, user }, res, next) => {
    TransactionService.move({ orderNumber, amount, price, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
  moveImmediate: ({ body: { orderNumber, amount, price }, user }, res, next) => {
    TransactionService.moveImmediate({ orderNumber, amount, price, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
  sell: ({ body: { pair, amount, price }, user }, res, next) => {
    TransactionService.sell({ pair, amount, price, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
  sellImmediate: ({ body: { pair, amount, price }, user }, res, next) => {
    TransactionService.sellImmediate({ pair, amount, price, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
  cancel: ({ body: { orderNumber }, user }, res, next) => {
    TransactionService.cancel({ orderNumber, user }).then(result => {
      res.json(result)
    }).catch(error => next(error))
  },
}
