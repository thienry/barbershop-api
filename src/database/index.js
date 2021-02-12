import mongoose from 'mongoose'
import Sequelize from 'sequelize'

import User from '../app/models/User'
import Upload from '../app/models/Upload'
import dbConfig from '../config/database'
import Appointment from '../app/models/Appointment'

const models = [User, Upload, Appointment]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(dbConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/gobarber', {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    })
  }
}

export default new Database()
