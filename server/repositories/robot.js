import Robot from '../models/robot'

export default {

  saveOrUpdateRobot: async (pair, data) => {
    const robot = await Robot.findOne({ pair })
    if (robot) {
      return robot.update(data, () => {})
    }
    return Robot.create({ ...data, pair })
  },

  getAll: () => Robot.find({}),

  getRobot: (pair) => Robot.findOne({ pair }),

}
