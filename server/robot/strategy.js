import PoloService from '../services/Polo'
import Helpers from '../utils/helpers'
import RobotRepository from '../repositories/robot'
import SellOrdersHandle from './handles/sellOrders'
import BuyOrdersHandle from './handles/buyOrders'
import CoinsAvailableHandle from './handles/coinsAvailable'
import BTCAvailableHandle from './handles/btcAvailable'

const INTERVAL_STRATEGY = 500

export default class Strategy {
  user = null
  mode = 'development'

  constructor(user, mode) {
    this.user = user
    this.mode = mode
  }

  init = async () => {
    this.runStrategy()
  }

  runStrategy = async () => {
    try {
      await this.applyStrategy()
    // eslint-disable-next-line
    } catch(err) {}
    setTimeout(() => {
      this.runStrategy()
    }, INTERVAL_STRATEGY)
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

  hasBuyOrders(openOrders) {
    return !!openOrders.buy.length
  }

  async applyStrategy() {
    const openOrdersResponse = await PoloService.fetchOpenOrders(this.user)
    const openOrders = Helpers.filterBuyAndSellOrders(openOrdersResponse)
    const coinsAvailableResponse = await PoloService.fetchCoinsAvailable(this.user)
    const coinsAvailable = Helpers.filterAvailableCoins(coinsAvailableResponse)
    const btcAvailable = this.getBTCAvailable(coinsAvailable)
    const robots = await RobotRepository.getRobots()
    // if (btcAvailable && OmniSuperPump.getAlert().active) {
    //   await OmniSuperPump.treatSuperPumpBtcAvailable(btcAvailable, this.user)
    //   return
    // }
    const tradeHistory = await PoloService.fetchTradeHistory(this.user, 'all')

    if (this.hasSellOrder(openOrders)) {
      // if (OmniSuperPump.getAlert().active) {
      //   await OmniSuperPump.treatOMNISellOrders(openOrders, tradeHistory, this.user, bookOrderAll)
      // } else {
      await SellOrdersHandle.treatSellOrders(
        openOrders.sell, tradeHistory, robots, this.user
      )
      // }
    }

    if (coinsAvailable.length) {
    //   if (OmniSuperPump.getAlert().active) {
    //     await OmniSuperPump.treatOMNICoinAvailable(coinsAvailable, tradeHistory, user, bookOrderAll)
    //   } else {
      await CoinsAvailableHandle.treatCoinsAvailable(
        coinsAvailable, tradeHistory, robots, this.user
      )
    //   }
    }

    if (this.hasBuyOrder(openOrders)) {
    //   if (OmniSuperPump.getAlert().active) {
    //     await OmniSuperPump.treatOMNIBuyOrders(openOrders, user)
    //   } else {
      await BuyOrdersHandle.treatBuyOrders(openOrders.buy, robots, this.user)
    //   }
    }

    if (btcAvailable) {
    //   if (OmniSuperPump.getAlert().active) {
    //     await OmniSuperPump.treatSuperPumpBtcAvailable(btcAvailable, user)
    //   } else {
      await BTCAvailableHandle.treatBTCAvailable(
        openOrders, coinsAvailable, btcAvailable, robots, this.user
      )
    //   }
    }
  }
}
