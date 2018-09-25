export default {
  isNestedBuy,
  isBuyActive,
  isNestedSell,
  isSellActive,
}

const isNestedBuy = robot => (robot.nestedBuy && robot.nestedBuy.active)
const isBuyActive = robot => (!robot.paused && robot.buy.active)

const isNestedSell = robot => (robot.nestedSell && robot.nestedSell.active)
const isSellActive = robot => (!robot.paused && robot.sell.active)
