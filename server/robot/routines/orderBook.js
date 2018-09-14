import PoloService from '../../services/Polo'

const INTERVAL_TIME_ORDER_BOOK = 1000
const ORDER_BOOK_DEEP = 15

export default class OrderBook {
  static orderBook = {}

  static init = async () => {
    PoloService.fetchOrderBookToAll(ORDER_BOOK_DEEP)
      .then(result => {
        this.orderBook = result
        this.recall()
      })
      .catch(() => this.recall())
  }

  static recall = () => {
    setTimeout(() => {
      this.init()
    }, INTERVAL_TIME_ORDER_BOOK)
  }
}
