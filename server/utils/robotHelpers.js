export default {
  isWatchFloor,
  isBuyActive,
  isWatchCeil,
  isSellActive,
}

const isWatchFloor = robot => (robot.watchFloor && robot.watchFloor.active)
const isBuyActive = robot => (!robot.paused && robot.buy.active)

const isWatchCeil = robot => (robot.watchCeil && robot.watchCeil.active)
const isSellActive = robot => (!robot.paused && robot.sell.active)
