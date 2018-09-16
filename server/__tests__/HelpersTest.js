/* eslint-env jest */
import Helpers from '../utils/helpers'
import CoinsAvailableMock from '../__mocks__/coinsAvailableMock'

test('test filterAvailableCoins', () => {
  expect(Helpers.filterAvailableCoins(CoinsAvailableMock.mock1).length)
    .toBe(3)
})

// test filterBuyAndSellOrders

// test getSmartPriceOfBuy

// test getFirstBTC

