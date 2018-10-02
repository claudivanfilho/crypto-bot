import RobotRepository from '../../repositories/robot'

const INTERVAL_TIME_ROBOT = 200

export let robots = {}

export default class Robot {
  static init = async () => {
    try {
      robots = await RobotRepository.getAll()
    // eslint-disable-next-line
    } catch(err) { }

    setTimeout(() => {
      Robot.init()
    }, INTERVAL_TIME_ROBOT)
  }
}
