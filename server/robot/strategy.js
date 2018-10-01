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
    const amountAvailable = Helpers.getBTCAvailable(coinsAvailable)
    const tradeHistory = await PoloService.fetchTradeHistory(this.user, 'all')
    const robots = await RobotRepository.getRobots()

    const argsToCondition = {
      openOrders, coinsAvailable, amountAvailable, robots, tradeHistory, user: this.user,
    }

    // Sell Order Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      openOrders.sell,
      [{
        conditions: [CO.isNestedSellActive, CO.nestedSellNumOfOrdersNotMatch ],
        action: AC.cancelSellOrdersWithSamePair,
        breakIfCatched: true,
      }, {
        conditions: [CO.isNestedSellActive, CO.nestedSellBidMarginExceedsLimits ],
        action: AC.cancelSellOrdersWithSamePair,
        breakIfCatched: true,
      }, {
        conditions: [CO.isSellActive, CO.hasMoreThanOneSellOrderWithSamePair ],
        action: AC.cancelSellOrdersWithSamePair,
        breakIfCatched: true,
      }, {
        conditions: [CO.isSellActive, CO.isCoveringAskActive ],
        action: AC.moveSellToLast,
      }, {
        conditions: [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpoint, CO.isSellImmediate],
        action: AC.moveSellImmediate,
      }, {
        conditions: [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpoint],
        action: AC.moveSellToLast,
      }, {
        conditions: [CO.isSellActive, CO.profitAskReachesMinProfitUp, CO.reachesMarginLimitUp],
        action: AC.moveSellToLast,
      }, {
        conditions: [CO.isSellActive, CO.profitBidReachesMinProfitUp, CO.sumAsksBiggerThanSumBids],
        action: AC.moveSellImmediate,
      }, {
        conditions: [CO.isSellActive, CO.hasFixedPrice, CO.reachesMarginFixedPriceDown],
        action: AC.cancelOrder,
      }, {
        conditions: [CO.isSellActive, CO.hasFixedPrice, CO.hasAmountToCoverBelowFixedSell],
        action: AC.sellToCoverAskAmount,
      }, {
        conditions: [],
        action: AC.cancelOrder,
      }]
    )

    // Coins Available Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      coinsAvailable.filter(coin => coin.coinName !== 'BTC'),
      [{
        conditions: [CO.isNestedSellActive, CO.isValidAmount],
        action: AC.doNestedSellOrders,
      }, {
        conditions: [CO.isSellActive, CO.isCoveringAskActive ],
        action: AC.sellToLast,
      }, {
        conditions: [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpointInSell, CO.isSellImmediate ],
        action: AC.sellImmediate,
      }, {
        conditions: [CO.isSellActive, CO.lastBidSmallerThanLowerBreakpointInSell],
        action: AC.sellToLast,
      }, {
        conditions: [CO.isSellActive, CO.profitAskReachesMinProfitUp, CO.reachesMarginLimitUp],
        action: AC.sellToLast,
      }, {
        conditions: [CO.isSellActive, CO.profitBidReachesMinProfitUp, CO.sumAsksBiggerThanSumBids],
        action: AC.sellImmediate,
      }, {
        conditions: [CO.isSellActive, CO.hasFixedPrice, CO.hasAmountToCoverBelowFixedSell],
        action: AC.moveToCoverAskAmount,
      }]
    )

    // Buy Orders Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      openOrders.buy,
      [{
        conditions: [CO.isNestedBuyActive, CO.nestedBuyNumOfOrdersNotMatch ],
        action: AC.cancelBuyOrdersWithSamePair,
      }, {
        conditions: [CO.isNestedBuyActive, CO.nestedBuyBidMarginExceedsLimits ],
        action: AC.cancelBuyOrdersWithSamePair,
      }, {
        conditions: [CO.isBuyActive, CO.hasMoreThanOneBuyOrderWithSamePair],
        action: AC.cancelBuyOrdersWithSamePair,
      }, {
        conditions: [CO.isBuyActive, CO.lastBidBiggerThanUpperBreakpointInBuy],
        action: AC.cancelOrder,
      }, {
        conditions: [CO.isBuyActive, CO.hasAskAmountToStop],
        action: AC.cancelOrder,
      }, {
        conditions: [CO.isBuyActive, CO.isCoveringBidActive],
        action: AC.moveBuyToLast,
      }, {
        conditions: [CO.isBuyActive, CO.lastBidSmallerThanLowerBreakpointInBuy],
        action: AC.cancelOrder,
      }, {
        conditions: [CO.isBuyActive, CO.hasBidAmountToActive],
        action: AC.buyToCoverBidAmount,
      }, {
        conditions: [],
        action: AC.cancelOrder,
      }]
    )

    // BTC available Treatments
    await RobotService.doActionToEach(
      argsToCondition,
      robots.filter(robot => Helpers.isBuyActive(robot)),
      [{
        conditions: [CO.isNestedBuyActive, CO.hasBtcAvailableToBuyOfRobot],
        action: AC.doNestedBuyOrders,
        breakIfCatched: true,
      }, {
        conditions: [CO.hasBtcAvailableToBuyOfRobot, CO.lastBidBiggerThanUpperBreakpointInBuy],
        action: () => {},
      }, {
        conditions: [CO.hasBtcAvailableToBuyOfRobot, CO.hasAskAmountToStop],
        action: () => {},
      }, {
        conditions: [CO.hasBtcAvailableToBuyOfRobot, CO.lastBidSmallerThanLowerBreakpointInBuy],
        action: () => {},
      }, {
        conditions: [CO.hasBtcAvailableToBuyOfRobot, CO.isCoveringBidActive],
        action: AC.buyToLast,
        breakIfCatched: true,
      }, {
        conditions: [CO.hasBtcAvailableToBuyOfRobot, CO.hasBidAmountToActive],
        action: AC.buyToCoverBidAmount,
        breakIfCatched: true,
      }]
    )
  }
}
