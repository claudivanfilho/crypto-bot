import mongoose from 'mongoose'
import crypto from 'crypto'

const Schema = mongoose.Schema

const encrypt = (text) => {
  if (!text) return ''
  var cipher = crypto.createCipher('aes-256-cbc', 'secret1298319283')
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

const decrypt = (text) => {
  if (!text) return text
  var decipher = crypto.createDecipher('aes-256-cbc', 'secret1298319283')
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

const userSchema = new Schema({
  id: String,
  provider: String,
  displayName: String,
  verificationCode: String,
  expirationDate: Date,
  email: '',
  photos: [
    {
      value: String,
    },
  ],
  picture: String,
  poloniex: {
    key: { type: String, default: '' },
    secret: { type: String, default: '' },
  },
  language: { type: String, default: 'en' },
  mainCoin: { type: String, default: 'BTC' },
})

userSchema.pre('save', function(next) {
  var user = this
  if (!user.isModified('poloniex')) {
    return next()
  }
  if (user.poloniex.key) {
    user.poloniex.key = encrypt(user.poloniex.key)
  }

  if (user.poloniex.secret) {
    user.poloniex.secret = encrypt(user.poloniex.secret)
  }

  next()
})

userSchema.post('findOne', function(user) {
  if (!user) return
  if (user.poloniex.key) {
    user.poloniex.key = decrypt(user.poloniex.key)
  }

  if (user.poloniex.secret) {
    user.poloniex.secret = decrypt(user.poloniex.secret)
  }
})

export default mongoose.model('User', userSchema)
