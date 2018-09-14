import PoloService from './Polo'
import Helpers from '../utils/helpers'

export default {
  buy: data => buy(data),
  buyImmediate: data => buy(data, true),
  move: data => move(data),
  moveImmediate: data => move(data, true),
  sell: data => sell(data),
  sellImmediate: data => sell(data, true),
  cancel: data => PoloService.cancel(data),
}

const buy = ({ pair, amount, price, user }, isImmediate) => {
  const amountCoin = Helpers.getAmountCoin(amount, price)
  return PoloService[isImmediate ? 'buyImmediate' : 'buy']({
    pair, price, amount: amountCoin, user,
  })
}

const move = ({ orderNumber, amount, price, user }, isImmediate) => (
  PoloService[isImmediate ? 'moveImmediate' : 'move']({
    orderNumber,
    price: parseFloat(price),
    amount: parseFloat(amount),
    user,
  })
)

const sell = ({ pair, amount, price, user }, isImmediate) => (
  PoloService[isImmediate ? 'sellImmediate' : 'sell']({
    pair,
    price: parseFloat(price),
    amount: parseFloat(amount),
    user,
  })
)
