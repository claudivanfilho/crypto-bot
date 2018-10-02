const Poloniex = require('./../libs/poloniex.js')
const poloInstance = new Poloniex({ socketTimeout: 40000 })

export const fetchOpenOrders = async (user) => {
  const polo = getPoloInstance(user)
  return polo.returnOpenOrders('all')
}

const returnCompleteBalances = (user) => {
  const polo = getPoloInstance(user)
  return polo.returnCompleteBalances('exchange')
}

function fetchTradeHistory(pair, start, end, user) {
  const polo = getPoloInstance(user)
  return polo.returnTradeHistory(pair, start, end)
}

function fetchMyTradeHistory(pair, start, end, user) {
  const polo = getPoloInstance(user)
  return polo.returnMyTradeHistory(pair, start, end)
}

function fetchOrderBookToAll(deep) {
  return poloInstance.returnOrderBook('All', deep)
}

function fetchGeneralTradeHistory(pair, start, end) {
  return poloInstance.returnTradeHistory(pair, start, end)
}

function fetchOrderBookOfCoin(pair, deep) {
  return poloInstance.returnOrderBook(pair, deep)
}

function fetchCoinChart(pair, period, start, end) {
  return poloInstance.returnChartData(pair, period, start, end)
}

function cancel({ orderNumber, user }) {
  const polo = getPoloInstance(user)
  return polo.cancelOrder(orderNumber)
}

function buyImmediate({ pair, price, amount, user }) {
  const polo = getPoloInstance(user)
  return polo.buy(pair, price, amount, 0, 1, 0)
}

function buy({ pair, price, amount, user }) {
  const polo = getPoloInstance(user)
  return polo.buy(pair, price, amount, 0, 0, 1)
}

function sellImmediate({ pair, price, amount, user }) {
  const polo = getPoloInstance(user)
  return polo.sell(pair, price, amount, 0, 1, 0)
}

function sell({ pair, price, amount, user }) {
  const polo = getPoloInstance(user)
  return polo.sell(pair, price, amount, 0, 0, 1)
}

function move({ orderNumber, price, amount, user }) {
  const polo = getPoloInstance(user)
  return polo.moveOrder(orderNumber, price, amount, 0, 1)
}

function moveImmediate({ orderNumber, price, amount, user }) {
  const polo = getPoloInstance(user)
  return polo.moveOrder(orderNumber, price, amount, 1, 0)
}

function getPoloInstance(user) {
  return new Poloniex(user.poloniex.key, user.poloniex.secret, { socketTimeout: 40000 })
}

export default {
  fetchCoinChart,
  fetchOpenOrders,
  fetchOrderBookToAll,
  fetchOrderBookOfCoin,
  returnCompleteBalances,
  fetchMyTradeHistory,
  fetchGeneralTradeHistory,
  fetchTradeHistory,
  buy,
  buyImmediate,
  move,
  moveImmediate,
  sell,
  sellImmediate,
  cancel,
}
