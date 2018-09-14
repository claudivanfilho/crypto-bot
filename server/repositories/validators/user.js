const POLONIEX_TABS = ['BTC', 'XMR', 'ETH', 'USDT']
const LANGS = ['pt', 'en']

export default ({ poloniex, language, mainCoin }) => {
  const key = poloniex && poloniex.key
  const secret = poloniex && poloniex.secret

  return !(
    (key && !secret || !key && secret) ||
    (language && !LANGS.includes(language)) ||
    (mainCoin && !POLONIEX_TABS.includes(mainCoin))
  )
}
