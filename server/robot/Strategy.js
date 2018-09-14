import PoloService from '../services/Polo'
import OrderBook from './routines/orderBook'
import Helpers from '../utils/helpers'
import RobotRepository from '../repositories/robot'
import SellOrdersHandle from './handles/sellOrder'

export default class Strategy {
  user = null
  mode = 'PRODUCTION'
  static orderBook = null

  constructor(user, mode) {
    this.user = user
    this.mode = mode
  }

  init() {
    OrderBook.init()
  }

  getBTCAvailable(coinsAvailable) {
    const btc = coinsAvailable.filter(
      coin => coin.coinName === 'BTC'
    ).pop()
    return (btc && btc.available) || 0
  }

  hasSellOrder(openOrders) {
    return !!openOrders.sell.length
  }

  async applyStrategy() {
    const openOrders = await PoloService.fetchOpenOrders(this.user)
    const coinsAvailableResponse = await PoloService.fetchCoinsAvailable(this.user)
    const coinsAvailable = Helpers.filterAvailableCoins(coinsAvailableResponse)
    const btcAvailable = this.getBTCAvailable(coinsAvailable)
    const robots = await RobotRepository.getRobots()
    // if (btcAvailable && OmniSuperPump.getAlert().active) {
    //   await OmniSuperPump.treatSuperPumpBtcAvailable(btcAvailable, this.user)
    //   return
    // }
    const myTradeHistory = await PoloService.fetchTradeHistory(this.user, 'all')

    if (this.hasSellOrder(openOrders)) {
      // if (OmniSuperPump.getAlert().active) {
      //   await OmniSuperPump.treatOMNISellOrders(openOrders, myTradeHistory, this.user, bookOrderAll)
      // } else {
      await SellOrdersHandle.treatSellOrders(openOrders, myTradeHistory, robots, this.user)
      // }
    }

    // if (coinsAvailable.length) {
    //   if (OmniSuperPump.getAlert().active) {
    //     await OmniSuperPump.treatOMNICoinAvailable(coinsAvailable, myTradeHistory, user, bookOrderAll)
    //   } else {
    //     await treatCoinsAvailable(coinsAvailable, myTradeHistory)
    //   }
    // }

    // if (hasBuyOrder(openOrders)) {
    //   if (OmniSuperPump.getAlert().active) {
    //     await OmniSuperPump.treatOMNIBuyOrders(openOrders, user)
    //   } else {
    //     await treatBuyOrders(openOrders)
    //   }
    // }

    // if (btcAvailable) {
    //   if (OmniSuperPump.getAlert().active) {
    //     await OmniSuperPump.treatSuperPumpBtcAvailable(btcAvailable, user)
    //   } else {
    //     await treatBTCAvailable(openOrders, coinsAvailable, btcAvailable)
    //   }
    // }
  }
}
