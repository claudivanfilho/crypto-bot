/* eslint-env jest */

import {
  buyToLast,
  cancelBuyOrdersWithSamePair,
  moveBuyToLast,
  moveBuyImmediate,
  buyImmediate,
  buyToCoverBidAmount,
  moveToCoverBidAmount,
  doNestedBuyOrders,
} from '../../robot/actions/buy'

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

describe('Test Buy Actions', () => {
  let myArgs

  beforeEach(() => {
    myArgs = { ...CONDITION_ARGS }
    myArgs.args.openOrders = mockOrders = { buy: [], sell: [] }
  })

  it('test buyToLast - normal case', async (done) => {
    myArgs.args.robots[0].buy.amount = 0.5
    buyToLast(myArgs).then(() => {
      expect(mockOrders.buy.length).toBe(1)
      const lastBidPlusOne = parseFloat(
        ORDERBOOK_ALL.BTC_NXT.bids[0][0]
      ) + 0.00000001
      expect(mockOrders.buy[0].rate).toBe(lastBidPlusOne)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test cancelBuyOrdersWithSamePair', async (done) => {
    myArgs.args.openOrders.buy = mockOrders.buy = [{
      orderNumber: 1,
      pair: 'BTC_NXT',
    }, {
      orderNumber: 2,
      pair: 'BTC_ETH',
    }]
    cancelBuyOrdersWithSamePair(myArgs).then(() => {
      expect(mockOrders.buy.length).toBe(1)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test moveBuyToLast', async (done) => {
    moveBuyToLast(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test moveBuyImmediate', async (done) => {
    moveBuyImmediate(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test buyImmediate', async (done) => {
    buyImmediate(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test buyToCoverBidAmount', async (done) => {
    myArgs.args.robots[0].buy.bidAmountToCover = 0.5
    buyToCoverBidAmount(myArgs).then(() => {
      expect(mockOrders.buy.length).toBe(1)
      expect(mockOrders.buy[0].rate).toBe(0.00001076)
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test moveToCoverBidAmount', async (done) => {
    moveToCoverBidAmount(myArgs).then(() => {
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })

  it('test doNestedBuyOrders', async (done) => {
    myArgs.args.robots[0].nestedBuy = {
      active: true,
      amount: 0.5,
      bidMargin: 2,
      numberOfOrders: 4,
      marginOrders: 3,
      amounts: [0.2, 0.2, 0.3],
    }
    doNestedBuyOrders(myArgs).then(() => {
      expect(mockOrders.buy).toMatchObject([
        { orderNumber: '120464',
          type: 'buy',
          rate: 0.0000105742,
          amount: 0.1,
          total: 0.00000105742,
          pair: 'BTC_NXT' },
        { orderNumber: '120464',
          type: 'buy',
          rate: 0.000010256973999999999,
          amount: 0.1,
          total: 0.0000010256973999999999,
          pair: 'BTC_NXT' },
        { orderNumber: '120464',
          type: 'buy',
          rate: 0.000009939748,
          amount: 0.15,
          total: 0.0000014909622,
          pair: 'BTC_NXT' },
        { orderNumber: '120464',
          type: 'buy',
          rate: 0.000009622522,
          amount: 0.14999995000000002,
          total: 0.0000014433778188739002,
          pair: 'BTC_NXT',
        },
      ])
      done()
    }).catch((err) => {
      done.fail(new Error(err.message))
    })
  })
})

jest.mock('../../services/Transaction', () => ({
  buy: ({ pair, amount, price }) => {
    mockOrders.buy.push({
      'orderNumber': '120464',
      'type': 'buy',
      'rate': price,
      'amount': amount,
      'total': price * amount,
      'pair': pair,
    })
  },
  buyImmediate: () => {},
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
