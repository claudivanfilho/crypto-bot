import Robot from '../models/robot'

export default {

  saveOrUpdateRobot: async (coinName, data) => {
    var robot = await Robot.findOne({ coinName: coinName })
    if (robot) {
      return robot.update(data, () => {})
    }
    return Robot.create({ ...data, coinName })
  },

  getAll: () => (Robot.find()),

  getRobot: (coinName) => (Robot.findOne({ coinName: coinName })),

}
