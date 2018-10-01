/* eslint-env jest */

import {
  isNestedSellActive,
  nestedSellNumOfOrdersNotMatch,
  nestedSellBidMarginExceedsLimits,
  isSellActive,
  hasMoreThanOneSellOrderWithSamePair,
  isCoveringAskActive,
  lastBidSmallerThanLowerBreakpointInSell,
  isSellImmediate,
  profitAskReachesMinProfitUp,
  profitBidReachesMinProfitUp,
  sumAsksBiggerThanSumBids,
  reachesMarginLimitUp,
  hasFixedPrice,
  reachesMarginFixedPriceDown,
  hasAmountToCoverBelowFixedSell,
} from '../../robot/conditions/sell'

// import { FOUR_COINS_NORMALIZED } from '../../__mocks__/coinsAvailableMock'
import { ORDERBOOK_ALL } from '../../__mocks__/orderBookMock'
import { ARRAY_WITH_ONE_ROBOT } from '../../__mocks__/robotsMock'
import { TWO_BUY_TWO_SELL_FILTERED, TWO_SELL_ORDERS_SAME_PAIR } from '../../__mocks__/openOrdersMock'
import { TRADE_HISTORY_NXT } from '../../__mocks__/tradeHistoryMock'

const CONDITION_ARGS = {
  args: {
    orderBookAll: ORDERBOOK_ALL,
    robots: ARRAY_WITH_ONE_ROBOT,
  },
  item: {
    pair: 'BTC_NXT',
    available: 0,
  },
}

describe('Test Sell Conditions', () => {
  it('test isNestedSellActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isNestedSellActive(myArgs)).toBe(false)
    myArgs.args.robots[0].nestedSell.active = true
    expect(isNestedSellActive(myArgs)).toBe(true)
  })

  it('test nestedSellNumOfOrdersNotMatch', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = TWO_SELL_ORDERS_SAME_PAIR
    expect(nestedSellNumOfOrdersNotMatch(myArgs)).toBe(true)
    myArgs.args.robots[0].nestedSell.numberOfOrders = 2
    expect(nestedSellNumOfOrdersNotMatch(myArgs)).toBe(false)
  })

  it('nestedSellBidMarginExceedsLimits', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = { ...TWO_BUY_TWO_SELL_FILTERED }
    myArgs.args.openOrders.sell[0].rate = '0.00001080'
    expect(nestedSellBidMarginExceedsLimits(myArgs)).toBe(false)
    myArgs.args.openOrders.sell[0].rate = '0.00001010'
    expect(nestedSellBidMarginExceedsLimits(myArgs)).toBe(true)
  })

  it('test isSellActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isSellActive(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.active = true
    expect(isSellActive(myArgs)).toBe(true)
  })

  it('test hasMoreThanOneSellOrderWithSamePair', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = { buy: [], sell: [] }
    expect(hasMoreThanOneSellOrderWithSamePair(myArgs)).toBe(false)
    myArgs.args.openOrders = TWO_SELL_ORDERS_SAME_PAIR
    expect(hasMoreThanOneSellOrderWithSamePair(myArgs)).toBe(true)
  })

  it('test isCoveringAskActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isCoveringAskActive(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.coveringAsk = true
    expect(isCoveringAskActive(myArgs)).toBe(true)
  })

  it('test lastBidSmallerThanLowerBreakpointInSell', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].sell.lowerBreakpointPrice = 0.00001089
    expect(lastBidSmallerThanLowerBreakpointInSell(myArgs)).toBe(true)
    myArgs.args.robots[0].sell.lowerBreakpointPrice = 0.00001069
    expect(lastBidSmallerThanLowerBreakpointInSell(myArgs)).toBe(false)
  })

  it('test isSellImmediate', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isSellImmediate(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.immediate = true
    expect(isSellImmediate(myArgs)).toBe(true)
  })

  it('test profitAskReachesMinProfitUp', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.tradeHistory = TRADE_HISTORY_NXT
    myArgs.args.robots[0].sell.minProfit = 10
    expect(profitAskReachesMinProfitUp(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.minProfit = 5
    expect(profitAskReachesMinProfitUp(myArgs)).toBe(true)
  })

  it('test profitBidReachesMinProfitUp', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.tradeHistory = TRADE_HISTORY_NXT
    myArgs.args.robots[0].sell.minProfit = 8
    expect(profitBidReachesMinProfitUp(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.minProfit = 7.9
    expect(profitBidReachesMinProfitUp(myArgs)).toBe(true)
  })

  it('test sumAsksBiggerThanSumBids', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(sumAsksBiggerThanSumBids(myArgs)).toBe(true)
    myArgs.args.orderBookAll.BTC_NXT.bids[0][1] = 10000000
    expect(sumAsksBiggerThanSumBids(myArgs)).toBe(false)
  })

  it('test reachesMarginLimitUp', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].sell.marginLimit = 0.5
    expect(reachesMarginLimitUp(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.marginLimit = 0.1
    expect(reachesMarginLimitUp(myArgs)).toBe(true)
  })

  it('test hasFixedPrice', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(hasFixedPrice(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.fixedPrice = 0.0009
    expect(hasFixedPrice(myArgs)).toBe(true)
  })

  it('test reachesMarginFixedPriceDown', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].sell.fixedPrice = 0.00001120
    myArgs.args.robots[0].sell.marginFixedPrice = 3
    expect(reachesMarginFixedPriceDown(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.marginFixedPrice = 7
    expect(reachesMarginFixedPriceDown(myArgs)).toBe(true)
  })

  it('test hasAmountToCoverBelowFixedSell', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].sell.fixedPrice = 0.00001120
    myArgs.args.robots[0].sell.askAmountToCover = 2
    expect(hasAmountToCoverBelowFixedSell(myArgs)).toBe(false)
    myArgs.args.robots[0].sell.askAmountToCover = 0.5
    expect(hasAmountToCoverBelowFixedSell(myArgs)).toBe(true)
  })
})

