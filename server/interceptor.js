import path from 'path'
import interceptor from 'express-interceptor'

export default interceptor((req, res) => {
  return {
    isInterceptable: function() {
      return true
    },
    intercept: function(body, send) {
      // if (req.user) {
      send(body)
      // } else {
      //   if (req.originalUrl.includes('/api/')) {
      //     res.status(401).json({ message: 'User not authenticated' })
      //   } else {
      //     res.sendFile(path.join(`${__dirname}/public/comertial.html`))
      //   }
      // }
    },
  }
})
