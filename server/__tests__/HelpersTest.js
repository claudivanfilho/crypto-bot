/* eslint-env jest */
import {
  getSmartPriceOfBuy,
  normalizeOpenOrders,
  filterAvailableCoins,
  getOrdersWithSamePair,
  getProfit,
  hasMoreThanOne,
  getAmountCoin,
  getBTCAvailable,
  findRobot,
  getAmountAvailableToBuyOfRobot,
} from '../utils/generalHelpers'

import { ORDERBOOK_ALL } from '../__mocks__/orderBookMock'
import { FOUR_COINS } from '../__mocks__/coinsAvailableMock'
import {
  ONE_BUY_ONE_SELL,
  TWO_SELLS_SAME_COIN,
  TWO_BUY_TWO_SELL_FILTERED,
} from '../__mocks__/openOrdersMock'
import { BUY_BETWEEN_SELLS } from '../__mocks__/tradeHistoryMock'

describe('Test Helpers', () => {
  it('test test filterAvailableCoins - with three coins with btcValue bigger than 0.0001',
    () => {
      expect(filterAvailableCoins(FOUR_COINS).length)
        .toBe(3)
    })

  it('test normalizeOpenOrders - with one buy and sell order', () => {
    const ordersNormalized = normalizeOpenOrders(ONE_BUY_ONE_SELL)
    const buyOrders = ordersNormalized.buy
    const sellOrders = ordersNormalized.sell
    expect(buyOrders.length).toBe(1)
    expect(sellOrders.length).toBe(1)
    expect(buyOrders[0].pair).toBe('BTC_EOS')
    expect(sellOrders[0].pair).toBe('BTC_NXT')
  })

  it('test getSmartPriceOfBuy - buy order between sell orders', () => {
    const smartPrice = getSmartPriceOfBuy(BUY_BETWEEN_SELLS, 'BTC_OMNI')
    expect(smartPrice).toBe(0.005022091733536982)
  })

  it('test getOrdersWithSamePair', () => {
    const sellOrders = normalizeOpenOrders(TWO_SELLS_SAME_COIN).sell
    expect(getOrdersWithSamePair('BTC_NXT', sellOrders).length).toBe(2)
  })

  it('test gestProfit', () => {
    expect(getProfit(10, 11)).toBe(10)
    expect(getProfit(10, 6)).toBe(-40)
  })

  it('test hasMoreThanOne', () => {
    expect(
      hasMoreThanOne('BTC_NXT', normalizeOpenOrders(TWO_SELLS_SAME_COIN).sell)
    ).toBe(true)
    expect(
      hasMoreThanOne('BTC_NXT', normalizeOpenOrders(ONE_BUY_ONE_SELL).sell)
    ).toBe(false)
  })

  it('test getAmountCoin', () => {
    expect(getAmountCoin(1000, 3.5)).toBe(285.71428571)
  })

  it('test getBTCAvailable', () => {
    const coinsArray = filterAvailableCoins(FOUR_COINS)
    expect(getBTCAvailable(coinsArray)).toBe(0.278)
  })

  it('test findRobot', () => {
    expect(findRobot([
      { pair: 'BTC_NXT' },
    ], {
      pair: 'BTC_NXT',
    })).toBeTruthy()
    expect(findRobot([
      { pair: 'BTC_NXT' },
    ], {
      pair: 'BTC_ETH',
    })).toBeFalsy()
  })

  it('test getAmountAvailableToBuyOfRobot', () => {
    expect(getAmountAvailableToBuyOfRobot(
      { buy: [], sell: [] }, [], 'BTC_NXT', 0.3, 2, ORDERBOOK_ALL
    )).toBe(0.3)

    expect(getAmountAvailableToBuyOfRobot(
      { buy: [], sell: [] }, [], 'BTC_NXT', 3, 2, ORDERBOOK_ALL
    )).toBe(2)

    expect(getAmountAvailableToBuyOfRobot(
      TWO_BUY_TWO_SELL_FILTERED, [], 'BTC_NXT', 0.3, 2, ORDERBOOK_ALL
    )).toBe(0.173921)

    expect(getAmountAvailableToBuyOfRobot(
      TWO_BUY_TWO_SELL_FILTERED, [], 'BTC_NXT', 0.3, 0.15, ORDERBOOK_ALL
    )).toBe(0.15)

    const coinsAvailable = [
      {
        'available': '5.015',
        'onOrders': '1.0025',
        'btcValue': '0.378',
        'coinName': 'NXT',
      },
    ]

    expect(getAmountAvailableToBuyOfRobot(
      TWO_BUY_TWO_SELL_FILTERED, coinsAvailable,
      'BTC_NXT', 0.3, 2, ORDERBOOK_ALL
    )).toBe(0)

    coinsAvailable[0].btcValue = 0.15

    expect(getAmountAvailableToBuyOfRobot(
      TWO_BUY_TWO_SELL_FILTERED, coinsAvailable,
      'BTC_NXT', 0.3, 2, ORDERBOOK_ALL
    )).toBe(0.023921)
  })
})
