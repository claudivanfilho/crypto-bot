import mongoose from 'mongoose'

mongoose.Promise = global.Promise

export default (app) => {
  return {
    connect: function() {
      switch (app.get('env')) {
        case 'development':
          mongoose.connect('mongodb://localhost/polodb', { useNewUrlParser: true })
          break
        case 'production':
          // mongoose.connect('mongodb://vanfilho:nodebase1@ds061385.mlab.com:61385/heroku_bnl381w2', opts);
          break
        default:
          throw new Error(`Unknown execution environment: ${app.get('env')}`)
      }
    },
  }
}
