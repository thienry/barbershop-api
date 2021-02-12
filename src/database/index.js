import chalk from 'chalk'
import mongoose from 'mongoose'
import Sequelize from 'sequelize'

import User from '../app/models/User'
import Upload from '../app/models/Upload'
import dbConfig from '../config/database'
import Appointment from '../app/models/Appointment'

const models = [User, Upload, Appointment]

class Database {
  constructor () {
    this.init()
    this.mongo()
  }

  init () {
    this.connection = new Sequelize(dbConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  async mongo () {
    try {
      this.mongoConnection = await mongoose.connect('mongodb://localhost:27017/gobarber', {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      })

      console.log(chalk.bgMagentaBright('MongoDB is connected'))
    } catch (error) {
      console.log(chalk.bgRedBright(error))
    }
  }
}

export default new Database()
