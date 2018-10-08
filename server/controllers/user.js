import UserRepository from '../repositories/user.js'

export default {

  get: (req, res) => {
    if (req.user) {
      res.json(UserRepository.dto(req.user))
    } else {
      throw new Error('User not authenticated')
    }
  },

  create: async ({ body: data }, res) => {
    const result = await UserRepository.create(data)
    res.json(result)
  },

  update: async ({ user, body: data, login }, res, next) => {
    UserRepository.update(user._id, data)
      .then(result => {
        login(result, () => {})
        res.json(UserRepository.dto(result))
      })
      .catch(err => next(err))
  },
}
