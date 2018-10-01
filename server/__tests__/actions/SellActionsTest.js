/* eslint-env jest */

import {
  cancelSellOrdersWithSamePair,
  cancelOrder,
  moveSellToLast,
  moveSellImmediate,
  sellToLast,
  sellImmediate,
  sellToCoverAskAmount,
  moveToCoverAskAmount,
  doNestedSellOrders,
} from '../../robot/actions/sell'

import { ORDERBOOK_ALL } from '../../__mocks__/orderBookMock'
import { ARRAY_WITH_ONE_ROBOT } from '../../__mocks__/robotsMock'
import { THREE_COINS_NORMALIZED } from '../../__mocks__/coinsAvailableMock'

let mockOrders = {
  buy: [],
  sell: [],
}

const CONDITION_ARGS = {
  args: {
    orderBookAll: ORDERBOOK_ALL,
    robots: ARRAY_WITH_ONE_ROBOT,
    openOrders: mockOrders,
    coinsAvailable: THREE_COINS_NORMALIZED,
    amountAvailable: 2,
  },
  item: {
    pair: 'BTC_NXT',
  },
}

describe('Test Sell Actions', () => {
  let myArgs

  beforeEach(() => {
    myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = mockOrders = { buy: [], sell: [] }
  })

  it('test sellToLast - normal case', async (done) => {
    sellToLast(myArgs).then(() => {
      expect(mockOrders.sell.length).toBe(1)
      const lastAskMinusOne = parseFloat(
        ORDERBOOK_ALL.BTC_NXT.asks[0][0]
      ) - 0.00000001
      expect(mockOrders.sell[0].rate).toBe(lastAskMinusOne)
      done()
    })
      .catch((err) => {
        done.fail(new Error(err.message))
      })
  })

  it('test cancelSellOrdersWithSamePair', async (done) => {
    myArgs.args.openOrders.sell = mockOrders.sell = [{
      orderNumber: 1,
      pair: 'BTC_NXT',
    }, {
      orderNumber: 2,
      pair: 'BTC_ETH',
    }]
    cancelSellOrdersWithSamePair(myArgs).then(() => {
      expect(mockOrders.sell.length).toBe(1)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test cancelOrder', async (done) => {
    myArgs.args.openOrders.sell = mockOrders.sell = [{
      orderNumber: '1',
      pair: 'BTC_NXT',
    }, {
      orderNumber: '2',
      pair: 'BTC_ETH',
    }]
    myArgs.item.orderNumber = '1'
    cancelOrder(myArgs).then(() => {
      expect(mockOrders.sell.length).toBe(1)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test moveSellToLast', async (done) => {
    moveSellToLast(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test moveSellImmediate', async (done) => {
    moveSellImmediate(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test sellImmediate', async (done) => {
    sellImmediate(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test sellToCoverAskAmount', async (done) => {
    myArgs.args.robots[0].sell.askAmountToCover = 0.7
    sellToCoverAskAmount(myArgs).then(() => {
      expect(mockOrders.sell.length).toBe(1)
      expect(mockOrders.sell[0].rate).toBe(0.00001082)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test moveToCoverAskAmount', async (done) => {
    moveToCoverAskAmount(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test doNestedSellOrders', async (done) => {
    myArgs.args.robots[0].nestedSell = {
      active: true,
      askMargin: 5,
      numberOfOrders: 3,
      marginOrders: 2,
      amounts: [0.2, 0.4],
    }
    myArgs.item.available = 1000
    doNestedSellOrders(myArgs).then(() => {
      expect(mockOrders.sell).toMatchObject([
        { orderNumber: '120465',
          type: 'sell',
          rate: 0.0000113505,
          amount: 200,
          total: 0.0022700999999999997,
          pair: 'BTC_NXT' },
        { orderNumber: '120465',
          type: 'sell',
          rate: 0.00001157751,
          amount: 400,
          total: 0.004631004,
          pair: 'BTC_NXT' },
        { orderNumber: '120465',
          type: 'sell',
          rate: 0.00001180452,
          amount: 399.99999995,
          total: 0.004721807999409774,
          pair: 'BTC_NXT' },
      ])
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
