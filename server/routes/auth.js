import passport from 'passport'
import express from 'express'
import authController from '../controllers/auth'
import path from 'path'

const router = express.Router()

router.post('/email', function(req, res, next) {
  if (!req.user) {
    return authController.sendEmail(req, res, next)
  }
  throw new Error('User already authenticated.')
})

router.get('/login', function(req, res) {
  if (!req.user) {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'))
  } else {
    res.redirect('/')
  }
})

router.post('/code', passport.authenticate('email-code'), (req, res) => {
  res.json({ message: 'Authenticated' })
})

router.post('/anonymous', passport.authenticate('anonymous'), (req, res) => {
  res.json({ message: 'Authenticated' })
})

router.post('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
  req.session.notice = 'You have successfully been logged out!'
  req.session.destroy()
})

export default router
