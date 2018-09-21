/* eslint-env jest */
import Helpers from '../utils/helpers'
import CoinsAvailableMock from '../__mocks__/coinsAvailableMock'

describe('Test Helpers', () => {
  it('test filterAvailableCoins', () => {
    expect(Helpers.filterAvailableCoins(CoinsAvailableMock.mock1).length)
      .toBe(3)
  })

  it('test filterBuyAndSellOrders', () => {
    expect(Helpers.filterAvailableCoins(CoinsAvailableMock.mock1).length)
      .toBe(3)
  })

  it('test getSmartPriceOfBuy', () => {
    expect(Helpers.filterAvailableCoins(CoinsAvailableMock.mock1).length)
      .toBe(3)
  })

  it('test getFirstBTC', () => {
    expect(Helpers.filterAvailableCoins(CoinsAvailableMock.mock1).length)
      .toBe(3)
  })
})
