import chalk from 'chalk'
import Bee from 'bee-queue'

import redisConfig from '../config/redis'
import CancellationMail from '../app/jobs/CancellationMail'

const jobs = [CancellationMail]

class Queue {
  constructor() {
    this.queues = {}

    this.init()
  }

  init() {
    for (const { key, handle } of jobs) {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        }),
        handle
      }
    }
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save()
  }

  processQueue() {
    for (const { key } of jobs) {
      const { bee, handle } = this.queues[key]
      bee.on('failed', this.handleFailure).process(handle)
    }
  }

  handleFailure(job, err) {
    console.log(chalk.bgRedBright(`Queue ${job.queue.name}: FAILED`, err))
  }
}

export default new Queue()
