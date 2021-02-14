import 'dotenv/config'

import cors from 'cors'
import path from 'path'
import redis from 'redis'
import Youch from 'youch'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import 'express-async-errors'
import * as Sentry from '@sentry/node'
import RateLimit from 'express-rate-limit'
import * as Tracing from '@sentry/tracing'
import RateLimitRedis from 'rate-limit-redis'

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
    this.server.use(cors())
    this.server.use(helmet())
    this.server.use(express.json())
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')))

    if (process.env.NODE_ENV === 'dev') {
      this.server.use(morgan('dev'))
      this.server.use(new RateLimit({
        store: new RateLimitRedis({
          client: redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
          })
        }),
        windowMs: 1000 * 60 * 15,
        max: 100
      }))
    }
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
