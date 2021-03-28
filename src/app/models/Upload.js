import Sequelize, { Model } from 'sequelize'

export default class Upload extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      size: Sequelize.NUMBER,
      type: Sequelize.STRING,
      s3: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get () {
          return process.env.STORAGE_TYPE === 'local' ? `${process.env.APP_HOST}:${process.env.APP_PORT}/files/${this.path}` : ''
        }
      }
    }, { sequelize })

    return this
  }
}
