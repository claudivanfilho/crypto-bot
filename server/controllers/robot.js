import RobotRepository from '../repositories/robot'

export default {

  getAll: async (res) => {
    const result = await RobotRepository.getAll()
    return res.json(result)
  },

  saveOrUpdate: async (req, res) => {
    await RobotRepository.saveOrUpdateRobot(req.params.pair, req.body)
    return res.json('Updated Succesfully')
  },

}
