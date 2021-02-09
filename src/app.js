import path from 'path'
import dotenv from 'dotenv'
import morgan from 'morgan'
import express from 'express'
import routes from './routes'

import './database'

class App {
  constructor () {
    this.server = express()
    this.dotenv = dotenv.config()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use(express.json())
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')))

    if (process.env.NODE_ENV === 'dev') this.server.use(morgan('dev'))
  }

  routes () {
    this.server.use(routes)
  }
}

export default new App().server
