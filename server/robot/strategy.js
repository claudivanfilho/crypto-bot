import RobotRepository from '../repositories/robot'
import PoloService from '../services/Polo'
import RobotService from '../services/Robot'
import Helpers from '../utils/index'
import CO from './conditions/index'
import AC from './actions/index'

export default class Strategy {
  user = null
  mode = 'development'

  constructor(user, mode) {
    this.user = user
    this.mode = mode
  }

  init = async (intervalStrategy) => {
    try {
      await this.applyStrategy()
      // eslint-disable-next-line
    } catch (err) { }
    setTimeout(() => {
      this.init()
    }, intervalStrategy)
  }

  async applyStrategy() {
    const openOrdersResponse = await PoloService.fetchOpenOrders(this.user)
    const openOrders = Helpers.normalizeOpenOrders(openOrdersResponse)
    const coinsAvailableResponse = await PoloService.fetchCoinsAvailable(this.user)
    const coinsAvailable = Helpers.filterAvailableCoins(coinsAvailableResponse)
    const btcAvailable = Helpers.getBTCAvailable(coinsAvailable)
    const tradeHistory = await PoloService.fetchTradeHistory(this.user, 'all')
    const robots = await RobotRepository.getRobots()

    const argsToCondition = {
      openOrders, coinsAvailable, btcAvailable, robots, tradeHistory, user: this.user,
    }

    // Sell Order Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      openOrders.sell,
      [
        [CO.isNestedSellActive, CO.nestedSellNumOfOrdersNotMatch ], AC.cancelSellOrdersWithSamePair, true,
        [CO.isNestedSellActive, CO.nestedSellBidMarginExceedsLimits ], AC.cancelSellOrdersWithSamePair, true,
        [CO.isSellActive, CO.hasMoreThanOneSellOrderWithSamePair ], AC.cancelSellOrdersWithSamePair, true,
        [CO.isSellActive, CO.isCoveringAskActive ], AC.moveSellToLast,
        [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpoint, CO.isSellImmediate ], AC.moveSellImmediate,
        [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpoint ], AC.moveSellToLast,
        [CO.isSellActive, CO.profitAskReachesMinProfitUp, CO.reachesMarginLimitUp], AC.moveSellToLast,
        [CO.isSellActive, CO.profitBidReachesMinProfitUp, CO.sumAsksBiggerThanSumBids], AC.moveSellImmediate,
        [CO.isSellActive, CO.hasFixedPrice, CO.reachesMarginFixedPriceDown], AC.cancelOrder,
        [CO.isSellActive, CO.hasFixedPrice, CO.hasAmountToCoverBelowFixedSell], AC.sellToCoverAskAmount,
        [], AC.cancelOrder,
      ]
    )

    // Coins Available Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      coinsAvailable.filter(coin => coin.coinName !== 'BTC'),
      [
        [CO.isNestedSellActive, CO.isValidAmount ], AC.doNestedSellOrders,
        [CO.isSellActive, CO.isCoveringAskActive ], AC.sellToLast,
        [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpoint, CO.isSellImmediate ], AC.sellImmediate,
        [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpoint ], AC.sellToLast,
        [CO.isSellActive, CO.profitAskReachesMinProfitUp, CO.reachesMarginLimitUp], AC.sellToLast,
        [CO.isSellActive, CO.profitBidReachesMinProfitUp, CO.sumAsksBiggerThanSumBids], AC.sellImmediate,
        [CO.isSellActive, CO.hasFixedPrice, CO.hasAmountToCoverBelowFixedSell], AC.moveToCoverAskAmount,
      ]
    )

    // Buy Orders Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      openOrders.buy,
      [
        [CO.isNestedBuyActive, CO.nestedBuyNumOfOrdersNotMatch ], AC.cancelBuyOrdersWithSamePair,
        [CO.isNestedBuyActive, CO.nestedBuyBidMarginExceedsLimits ], AC.cancelBuyOrdersWithSamePair,
        [CO.isBuyActive, CO.hasMoreThanOneBuyOrderWithSamePair], AC.cancelBuyOrdersWithSamePair,
        [CO.isBuyActive, CO.lastBidBiggerThanUpperBreakpointInBuy], AC.cancelOrder,
        [CO.isBuyActive, CO.hasAskAmountToStop], AC.cancelOrder,
        [CO.isBuyActive, CO.isCoveringBidActive], AC.moveBuyToLast,
        [CO.isBuyActive, CO.lastBidSmallerThanLowerBreakpoint], AC.cancelOrder,
        [CO.isBuyActive, CO.hasBidAmountToActive], AC.buyToCoverBidAmount,
        [], AC.cancelOrder,
      ]
    )

    // BTC available Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      robots.filter(robot => Helpers.isBuyActive(robot)),
      [
        [CO.isNestedBuyActive, CO.hasBtcAvailableToBuyOfRobot], AC.doNestedBuyOrders,
        [CO.hasBtcAvailableToBuyOfRobot, CO.lastBidBiggerThanUpperBreakpointInBuy], () => {},
        [CO.hasBtcAvailableToBuyOfRobot, CO.hasAskAmountToStop], () => {},
        [CO.hasBtcAvailableToBuyOfRobot, CO.lastBidSmallerThanLowerBreakpointInBuy], () => {},
        [CO.hasBtcAvailableToBuyOfRobot, CO.isCoveringBidActive], AC.buyToLast,
        [CO.hasBtcAvailableToBuyOfRobot, CO.hasBidAmountToActive], AC.buyToCoverBidAmount,
      ]
    )
  }
}
