import api from './routes/api'
import auth from './routes/auth.js'
import user from './routes/user.js'
import requestInterceptor from './interceptor'

export default (app) => {
  app.use(requestInterceptor)

  /**
   * Api routes
   */
  app.use('/api/v1', api)

  /**
   * Auth routes
   */
  app.use('/auth', auth)

  /**
   * User routes
   */
  app.use('/', user)
}
