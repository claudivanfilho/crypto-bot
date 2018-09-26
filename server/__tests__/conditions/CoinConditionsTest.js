/* eslint-env jest */

import { isValidAmount } from '../../robot/conditions/coin'
import { ORDERBOOK_ALL } from '../../__mocks__/orderBookMock'
import { ARRAY_WITH_ONE_ROBOT } from '../../__mocks__/robotsMock'

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

describe('Test Coin Conditions', () => {
  it('test isValidAmount - with an amount with btcValue smaller than 0.0001', () => {
    const myArgs = {
      ...CONDITION_ARGS,
      item: {
        ...CONDITION_ARGS.item, available: 0.5,
      },
    }
    expect(isValidAmount(myArgs)).toBe(false)
  })

  it('test isValidAmount - with a valid amount', () => {
    const myArgs = {
      ...CONDITION_ARGS,
      item: {
        ...CONDITION_ARGS.item, available: 100,
      },
    }
    expect(isValidAmount(myArgs)).toBe(true)
  })
})
