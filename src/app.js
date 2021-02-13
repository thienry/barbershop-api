import 'dotenv/config'
import path from 'path'
import Youch from 'youch'
import morgan from 'morgan'
import express from 'express'
import 'express-async-errors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import routes from './routes'
import sentryConfig from './config/sentry'

import './database'

class App {
  constructor () {
    this.server = express()

    this.initSentry()
    this.middlewares()
    this.routes()
    this.exceptionHandler()
  }

  initSentry () {
    Sentry.init({
      dsn: sentryConfig.dsn,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app: this.server })
      ],
      tracesSampleRate: 1.0
    })
  }

  middlewares () {
    this.server.use(Sentry.Handlers.requestHandler())
    this.server.use(Sentry.Handlers.tracingHandler())
    this.server.use(express.json())
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')))

    if (process.env.NODE_ENV === 'dev') this.server.use(morgan('dev'))
  }

  routes () {
    this.server.use(routes)
    this.server.use(Sentry.Handlers.errorHandler())
  }

  exceptionHandler () {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'dev') {
        const errors = await new Youch(err, req).toJSON()
        return res.status(500).json(errors)
      }

      return res.status(500).json({ error: 'Internal Server Error!' })
    })
  }
}

export default new App().server
