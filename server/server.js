import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import session from 'express-session'

import routes from './routes'
import authFace from './auth/face'
import database from './database'
import robot from './robot/index'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '../build')))
app.use(
  session({
    secret: 'polo-trader',
    resave: false,
    saveUninitialized: true,
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

routes(app)
authFace(app)
database(app).connect()

app.use((err, req, res, next) => {
  if (err.message) {
    res.status(500)
    res.json({ message: err.message })
  } else {
    next(err)
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

robot.init(
  process.env.ROBOT_POLONIEX_API_KEY,
  process.env.ROBOT_POLONIEX_API_SECRET
)
app.listen(port)
console.log(`Server started in the port ${port}`)
