import PoloService from '../../services/Polo'

const INTERVAL_TIME_ORDER_BOOK = 500
const ORDER_BOOK_DEEP = 15

export let orderBook = {}

export default class OrderBook {
  static init = async () => {
    PoloService.fetchOrderBookToAll(ORDER_BOOK_DEEP)
      .then(result => {
        orderBook = result
        setTimeout(() => {
          OrderBook.init()
        }, INTERVAL_TIME_ORDER_BOOK)
      })
      .catch(() => {
        setTimeout(() => {
          OrderBook.init()
        }, INTERVAL_TIME_ORDER_BOOK)
      })
  }
}
