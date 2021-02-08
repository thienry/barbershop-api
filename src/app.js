import express from 'express'
import morgan from 'morgan'
import routes from './routes'

import './database'

class App {
  constructor () {
    this.server = express()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use(express.json())
    if (process.env.NODE_ENV === 'dev') this.express.use(morgan('dev'))
  }

  routes () {
    this.server.use(routes)
  }
}

export default new App().server
