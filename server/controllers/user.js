import UserRepository from '../repositories/user.js'

export default {

  get: (req) => UserRepository.dto(req.user),

  create: async ({ body: data }, res) => {
    const result = await UserRepository.create(data)
    res.send(result)
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
