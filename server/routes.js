// var index = require('./routes/index.route.js')
// var face = require('./routes/face-auth.route.js')
// var user = require('./routes/user.route.js')
// var api = require('./routes/api.route.js')
import api from './routes/api'

import requestInterceptor from './interceptor'

export default (app) => {
  app.use(requestInterceptor)

  // /**
  //  * Initial routes
  //  */
  // app.use('/', index)

  /**
   * Api routes
   */
  app.use('/api/v1', api)

  // /**
  //  * Facebook authentication
  //  */
  // app.use('/', face)
  // /**
  //  * Api user
  //  */
  // app.use('/', user)
}
