import interceptor from 'express-interceptor'

const isAPIResource = (req) => req.originalUrl.includes('/api/')
const isCodeResource = (req) => req.originalUrl === '/auth/code'
const isLoginResource = (req) => req.originalUrl.includes('login')
const isAnonymous = (req) => !!req.user.anonymous

export default interceptor((req, res) => {
  return {
    isInterceptable: () => {
      return true
    },
    intercept: function(body, send) {
      if (req.user || isLoginResource(req)) {
        if (isAPIResource(req)) {
          if (process.env.EMAIL_AUTHORIZED === req.user.email) {
            send(body)
          } else if (isAnonymous(req)) {
            res.json({})
          } else {
            res.json({})
          }
        } else {
          send(body)
        }
      } else {
        if (isAPIResource(req)) {
          res.json({})
        } else {
          if (!isCodeResource(req)) {
            send(body)
          }
        }
      }
    },
  }
})

