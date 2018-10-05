// import moment from 'moment'
const POLO_HOST_URL = 'https://poloniex.com/public?'

export default {
  fetchUser: () => fetch('/user').then(res => res.json()),
  fetchOrderBook: ({ pair = 'All', deep = 15 }) => (
    fetch(`${POLO_HOST_URL}command=returnOrderBook&
      currencyPair=${pair}&depth=${deep}`)
      .then(res => res.json())
  ),
  fetchTradeHistory: ({
    pair = 'All',
    start,
    end,
  }) => {
    let url = `${POLO_HOST_URL}command=returnTradeHistory&currencyPair=${pair}`
    if (start) url += `&start=${start}`
    if (end) url += `&end=${end}`
    return fetch(url)
      .then(res => res.json())
  },
  fetchRobots: () => fetch('/api/v1/robots').then(res => res.json()),
  updateRobot: () => {},
  fetchCoinsAvailable: () => fetch('/api/v1/coinsAvailable').then(res => res.json()),
  fetchOpenOrders: () => fetch('/api/v1/openOrders').then(res => res.json()),
  fetchMyTradeHistory: () => fetch('/api/v1/tradeHistory').then(res => res.json()),
  fetchChart: ({
    pair = 'All',
    start,
    end,
    period = 900,
  }) => {
    let url = `${POLO_HOST_URL}command=returnChartData&currencyPair=${pair}`
    if (start) url += `&start=${start}`
    if (end) url += `&end=${end}`
    if (period) url += `&period=${period}`
    return fetch(url)
      .then(res => res.json())
  },
  enterWithoutLogin: () => (
    fetch('/auth/anonymous', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
  ),
  sendCode: (code) => (
    fetch('/auth/code', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
  ),
  sendEmailCode: (email) => (
    fetch('/auth/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
  ),
}
