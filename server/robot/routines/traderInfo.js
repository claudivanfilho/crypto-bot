import PoloService from '../../services/Polo'
import Helpers from '../../utils/index'
import moment from 'moment'

const INTERVAL_TIME_TRADER_INFO = 500

export let tradeHistory = null
export let openOrders = null
export let amountAvailable = null
export let coinsAvailable = null

export default class TraderInfo {
  static init = async (user) => {
    try {
      const openOrdersResponse = await PoloService.fetchOpenOrders(user)
      openOrders = Helpers.normalizeOpenOrders(openOrdersResponse)
      const coinsAvailableResponse = await PoloService.returnCompleteBalances(user)
      coinsAvailable = Helpers.filterAvailableCoins(coinsAvailableResponse)
      amountAvailable = Helpers.getBTCAvailable(coinsAvailable)
      const start = moment().subtract(90, 'day').startOf('day').unix()
      const end = moment().unix()
      tradeHistory = await PoloService.fetchMyTradeHistory('all', start, end, user)
    // eslint-disable-next-line
    } catch(err) { }

    setTimeout(() => {
      TraderInfo.init(user)
    }, INTERVAL_TIME_TRADER_INFO)
  }
}
