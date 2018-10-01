/* eslint-env jest */

import {
  isNestedBuyActive,
  nestedBuyNumOfOrdersNotMatch,
  isBuyActive,
  hasMoreThanOneBuyOrderWithSamePair,
  isCoveringBidActive,
  lastBidBiggerThanUpperBreakpointInBuy,
  lastBidSmallerThanLowerBreakpointInBuy,
  hasAskAmountToStop,
  hasBidAmountToActive,
  hasAmountAvailableToBuyOfRobot,
} from '../../robot/conditions/buy'

import { THREE_COINS_NORMALIZED } from '../../__mocks__/coinsAvailableMock'
import { ORDERBOOK_ALL } from '../../__mocks__/orderBookMock'
import { ARRAY_WITH_ONE_ROBOT } from '../../__mocks__/robotsMock'
import { TWO_BUY_TWO_SELL_FILTERED } from '../../__mocks__/openOrdersMock'

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

describe('Test Buy Conditions', () => {
  it('test isNestedBuyActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isNestedBuyActive(myArgs)).toBe(false)
    myArgs.args.robots[0].nestedBuy.active = true
    expect(isNestedBuyActive(myArgs)).toBe(true)
  })

  it('test nestedBuyNumOfOrdersNotMatch', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = TWO_BUY_TWO_SELL_FILTERED
    expect(nestedBuyNumOfOrdersNotMatch(myArgs)).toBe(true)
    myArgs.args.robots[0].nestedBuy.numberOfOrders = 2
    expect(nestedBuyNumOfOrdersNotMatch(myArgs)).toBe(false)
  })

  it('test isBuyActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isBuyActive(myArgs)).toBe(false)
    myArgs.args.robots[0].buy.active = true
    expect(isBuyActive(myArgs)).toBe(true)
  })

  it('test hasMoreThanOneBuyOrderWithSamePair', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = { buy: [], sell: [] }
    expect(hasMoreThanOneBuyOrderWithSamePair(myArgs)).toBe(false)
    myArgs.args.openOrders = TWO_BUY_TWO_SELL_FILTERED
    expect(hasMoreThanOneBuyOrderWithSamePair(myArgs)).toBe(true)
  })

  it('test isCoveringBidActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    expect(isCoveringBidActive(myArgs)).toBe(false)
    myArgs.args.robots[0].buy.coveringBid = true
    expect(isCoveringBidActive(myArgs)).toBe(true)
  })

  it('test lastBidBiggerThanUpperBreakpointInBuy', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].buy.upperBreakpointPrice = 0.00001089
    expect(lastBidBiggerThanUpperBreakpointInBuy(myArgs)).toBe(false)
    myArgs.args.robots[0].buy.upperBreakpointPrice = 0.00001069
    expect(lastBidBiggerThanUpperBreakpointInBuy(myArgs)).toBe(true)
  })

  it('test lastBidBiggerThanUpperBreakpointInBuy', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].buy.lowerBreakpointPrice = 0.00001089
    expect(lastBidSmallerThanLowerBreakpointInBuy(myArgs)).toBe(true)
    myArgs.args.robots[0].buy.lowerBreakpointPrice = 0.00001069
    expect(lastBidSmallerThanLowerBreakpointInBuy(myArgs)).toBe(false)
  })

  it('test hasAskAmountToStop', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].buy.askAmountToStop = 3
    expect(hasAskAmountToStop(myArgs)).toBe(false)
    myArgs.args.robots[0].buy.askAmountToStop = 1
    expect(hasAskAmountToStop(myArgs)).toBe(true)
  })

  it('test hasBidAmountToActive', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.robots[0].buy.bidAmountToActive = 0.15
    expect(hasBidAmountToActive(myArgs)).toBe(true)
    myArgs.args.robots[0].buy.bidAmountToActive = 10
    expect(hasBidAmountToActive(myArgs)).toBe(false)
  })

  it('test hasAmountAvailableToBuyOfRobot', () => {
    const myArgs = { ...CONDITION_ARGS }
    myArgs.args.coinsAvailable = THREE_COINS_NORMALIZED
    myArgs.args.openOrders = { buy: [], sell: [] }
    myArgs.args.amountAvailable = 2
    myArgs.args.robots[0].buy.amount = 0.15
    expect(hasAmountAvailableToBuyOfRobot(myArgs)).toBe(true)
    myArgs.args.amountAvailable = 0
    expect(hasAmountAvailableToBuyOfRobot(myArgs)).toBe(false)
  })
})
