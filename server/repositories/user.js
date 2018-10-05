import UserModel from '../models/user.js'
import UserValidator from './validators/user'

export default {

  dto: (user) => (user && {
    displayName: user.displayName,
    picture: user.picture,
    language: user.language,
    mainCoin: user.mainCoin,
    anonymous: user.anonymous,
  }),

  create: (data) => UserModel.create(data),

  update: async (userId, data) => {
    if (!UserValidator.validateData(data)) {
      throw new Error('Invalid Params')
    }
    return UserModel.findOneAndUpdate({ _id: userId }, data, { new: true })
  },

  findById: (id) => (UserModel.findOne({ _id: id })),

  findOne: (data) => (UserModel.findOne(data)),

  find: (data) => (UserModel.find(data)),

}
