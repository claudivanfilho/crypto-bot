import PoloService from '../../services/Polo'
import Helpers from '../../utils/index'
import RobotRepository from '../repositories/robot'

const INTERVAL_TIME_TRADER_INFO = 500

export default class OrderBook {
  static tradeHistory = null
  static robots = null
  static openOrders = null
  static coinsAvailable = null
  static amountAvailable = null

  static init = async (user) => {
    const openOrdersResponse = await PoloService.fetchOpenOrders(user)
    const openOrders = Helpers.normalizeOpenOrders(openOrdersResponse)
    const coinsAvailableResponse = await PoloService.fetchCoinsAvailable(user)
    const coinsAvailable = Helpers.filterAvailableCoins(coinsAvailableResponse)
    const amountAvailable = Helpers.getBTCAvailable(coinsAvailable)
    const tradeHistory = await PoloService.fetchTradeHistory(user, 'all')
    const robots = await RobotRepository.getRobots()

    this.robots = robots
    this.tradeHistory = tradeHistory
    this.openOrders = openOrders
    this.amountAvailable = amountAvailable
    this.coinsAvailable = coinsAvailable
  }

  recall = () => {
    setTimeout(() => {
      this.init()
    }, INTERVAL_TIME_TRADER_INFO)
  }
}
