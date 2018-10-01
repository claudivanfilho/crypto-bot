import PoloService from './Polo'
import { getAmountCoin } from '../utils/generalHelpers'

export default {
  buy: ({ pair, amount, price, user }) => { console.log('get out') },
  // buy({ pair, amount, price, user }),
  buyImmediate: ({ pair, amount, price, user }) => buy({ pair, amount, price, user }, true),
  move: ({ orderNumber, amount, price, user }) => move({ orderNumber, amount, price, user }),
  moveImmediate: ({ orderNumber, amount, price, user }) => move({ orderNumber, amount, price, user }, true),
  sell: ({ pair, amount, price, user }) => sell({ pair, amount, price, user }),
  sellImmediate: ({ pair, amount, price, user }) => sell({ pair, amount, price, user }, true),
  cancel: ({ orderNumber, amount, price, user }) => PoloService.cancel(
    { orderNumber, amount, price, user }
  ),
  cancelOrders: async (orders, user) => {
    for (let j = 0; j < orders.length; j++) {
      try {
        await PoloService.cancel({ orderNumber: orders[j].orderNumber, user })
      // eslint-disable-next-line
      } catch (err) {}
    }
  },
}

const buy = ({ pair, amount, price, user }, isImmediate) => {
  const amountCoin = getAmountCoin(amount, price)
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
