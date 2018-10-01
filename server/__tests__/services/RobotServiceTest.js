/* eslint-env jest */

import {
  doActionToEach,
} from '../../services/Robot'

import {
  isSellActive,
  isCoveringAskActive,
} from '../../robot/conditions/sell'
import {
  cancelOrder,
} from '../../robot/actions/sell'

import { ORDERBOOK_ALL } from '../../__mocks__/orderBookMock'
import { ARRAY_WITH_ONE_ROBOT } from '../../__mocks__/robotsMock'
import { TWO_BUY_TWO_SELL_FILTERED } from '../../__mocks__/openOrdersMock'

let mockOrders = { ...TWO_BUY_TWO_SELL_FILTERED }

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

describe('Test Robot Service', () => {
  let myArgs

  beforeEach(() => {
    myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = mockOrders = { ...TWO_BUY_TWO_SELL_FILTERED }
  })

  it('test doActionToEach - without conditions', (done) => {
    expect(mockOrders.sell.length).toBe(2)
    doActionToEach(
      myArgs.args,
      TWO_BUY_TWO_SELL_FILTERED.sell,
      [{
        conditions: [],
        action: cancelOrder,
      }]
    ).then(() => {
      expect(mockOrders.sell.length).toBe(0)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test doActionToEach - with one condition falsy', (done) => {
    myArgs.args.robots[0].sell.active = false
    expect(mockOrders.sell.length).toBe(2)
    doActionToEach(
      myArgs.args,
      TWO_BUY_TWO_SELL_FILTERED.sell,
      [{
        conditions: [isSellActive],
        action: cancelOrder,
      }]
    ).then(() => {
      expect(mockOrders.sell.length).toBe(2)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test doActionToEach - with one condition truthy', (done) => {
    myArgs.args.robots[0].sell.active = true
    expect(mockOrders.sell.length).toBe(2)
    doActionToEach(
      myArgs.args,
      TWO_BUY_TWO_SELL_FILTERED.sell,
      [{
        conditions: [isSellActive],
        action: cancelOrder,
      }]
    ).then(() => {
      expect(mockOrders.sell.length).toBe(1)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test doActionToEach - with two conditions', (done) => {
    expect(mockOrders.sell.length).toBe(2)
    myArgs.args.robots[0].sell.active = true
    myArgs.args.robots[0].sell.coveringAsk = true
    doActionToEach(
      myArgs.args,
      TWO_BUY_TWO_SELL_FILTERED.sell,
      [{
        conditions: [isSellActive, isCoveringAskActive],
        action: cancelOrder,
      }]
    ).then(() => {
      expect(mockOrders.sell.length).toBe(1)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })
})

jest.mock('../../services/Transaction', () => ({
  sell: ({ pair, amount, price }) => {
    mockOrders.sell.push({
      'orderNumber': '120465',
      'type': 'sell',
      'rate': price,
      'amount': amount,
      'total': price * amount,
      'pair': pair,
    })
  },
  sellImmediate: () => {},
  move: () => {},
  moveImmediate: () => {},
  cancel: ({ orderNumber }) => {
    const buyOrders = mockOrders.buy.filter(order => order.orderNumber !== orderNumber)
    const sellOrders = mockOrders.sell.filter(order => order.orderNumber !== orderNumber)
    mockOrders.buy = buyOrders
    mockOrders.sell = sellOrders
  },
  cancelOrders: async (orders) => {
    const orderNumbers = orders.map(order => (order.orderNumber))
    const buyOrders = mockOrders.buy.filter(order =>
      !orderNumbers.includes(order.orderNumber)
    )
    const sellOrders = mockOrders.sell.filter(order =>
      !orderNumbers.includes(order.orderNumber)
    )
    mockOrders.buy = buyOrders
    mockOrders.sell = sellOrders
  },
}))

