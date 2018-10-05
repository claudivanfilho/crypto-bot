import UserRepository from '../repositories/user'
import {
  generateExpirationDate,
  generateVerificationCode,
  sendVerificationCode,
} from '../services/EmailCode'

export default {

  sendEmail: async (req, res) => {
    const email = req.body.email
    const verificationCode = generateVerificationCode()
    const expirationDate = generateExpirationDate()
    let userFound = await UserRepository.findOne({ email })
    if (!userFound) {
      userFound = await UserRepository.create(
        { email, expirationDate, verificationCode }
      )
    } else {
      userFound.verificationCode = verificationCode
      userFound.expirationDate = expirationDate
      await userFound.save()
    }
    sendVerificationCode(verificationCode, email)
    req.session.email = email
    return res.json({ message: 'Email code sent!' })
  },

}
