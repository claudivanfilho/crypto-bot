import passport from 'passport'
import { Strategy } from 'passport-facebook'
import { Strategy as CustomStrategy } from 'passport-custom'
import UserRepository from '../repositories/user'
import {
  isCodeValid,
} from '../services/EmailCode'

export default (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  passport.use(new Strategy({
    clientID: process.env.FACE_APP_ID,
    clientSecret: process.env.FACE_APP_SECRET,
    callbackURL: process.env.FACE_CALLBACK_URL,
    profileFields: ['emails', 'displayName', 'gender', 'name', 'picture'],
  }, async (accessToken, refreshToken, profile, done) => {
    const userFound = await UserRepository.findOne({ id: profile.id, provider: profile.provider })
    if (!userFound) {
      const userData = {
        id: profile.id,
        displayName: profile.displayName,
        provider: profile.provider,
        picture: JSON.parse(profile._raw).picture.data.url,
      }
      const userCreated = await UserRepository.create(userData)
      if (!userCreated) done(null, null)
      else done(null, userCreated)
    } else {
      done(null, userFound)
    }
  }))

  passport.use('email-code', new CustomStrategy(
    async (req, done) => {
      const code = req.body.code
      const userFound = await UserRepository.findOne({ email: req.session.email })
      if (userFound) {
        const isValid = isCodeValid(code, userFound)
        if (isValid) {
          done(null, userFound)
        }
        done(null, null)
      } else {
        done(null, null)
      }
    }
  ))

  passport.use('anonymous', new CustomStrategy(
    async (req, done) => {
      done(null, {
        anonymous: true,
      })
    }
  ))
}
