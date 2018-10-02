// import moment from 'moment'
const POLO_HOST_URL = 'https://poloniex.com/public?'

export default {
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
  fetchRobots: () => fetch('api/v1/robots').then(res => res.json()),
  updateRobot: () => {},
  fetchCoinsAvailble: () => fetch('api/v1/coinsAvailable').then(res => res.json()),
  fetchOpenOrders: () => fetch('api/v1/openOrders').then(res => res.json()),
  fetchMyTradeHistory: () => fetch('api/v1/tradeHistory').then(res => res.json()),
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
}
