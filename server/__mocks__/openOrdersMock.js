export const ONE_BUY_ONE_SELL = {
  'BTC_EOS': [
    {
      'orderNumber': '120465',
      'type': 'buy',
      'rate': '0.0008',
      'amount': '100',
      'total': '0.08',
    },
  ],
  'BTC_NXT': [
    {
      'orderNumber': '120466',
      'type': 'sell',
      'rate': '0.00002',
      'amount': '2500',
      'total': '0.05',
    },
  ],
}

export const TWO_SELLS_SAME_COIN = {
  'BTC_NXT': [
    {
      'orderNumber': '120466',
      'type': 'sell',
      'rate': '0.00002',
      'amount': '2500',
      'total': '0.05',
    },
    {
      'orderNumber': '120466',
      'type': 'sell',
      'rate': '0.00003',
      'amount': '2500',
      'total': '0.05',
    },
  ],
}

export const TWO_BUY_TWO_SELL_FILTERED = {
  buy: [
    {
      'orderNumber': '120466',
      'type': 'sell',
      'rate': '0.00002',
      'amount': '2500',
      'total': '0.05',
      'pair': 'BTC_NXT',

    },
    {
      'orderNumber': '120464',
      'type': 'sell',
      'rate': '0.00003',
      'amount': '2500',
      'total': '0.075',
      'pair': 'BTC_NXT',
    },
  ],
  sell: [
    {
      'orderNumber': '120465',
      'type': 'sell',
      'rate': '0.0008',
      'amount': '100',
      'total': '0.08',
      'pair': 'BTC_NXT',
    },
    {
      'orderNumber': '120467',
      'type': 'sell',
      'rate': '0.00002',
      'amount': '2500',
      'total': '0.05',
      'pair': 'BTC_EOS',
    },
  ],
}

export const TWO_SELL_ORDERS_SAME_PAIR = {
  sell: [
    {
      'orderNumber': '120465',
      'type': 'buy',
      'rate': '0.0008',
      'amount': '100',
      'total': '0.08',
      'pair': 'BTC_NXT',
    },
    {
      'orderNumber': '120465',
      'type': 'buy',
      'rate': '0.0008',
      'amount': '100',
      'total': '0.08',
      'pair': 'BTC_NXT',
    },
  ],
}
