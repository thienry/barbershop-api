import Sequelize, { Model } from 'sequelize'

export default class Upload extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get () {
          return `http://localhost:5000/files/${this.path}`
        }
      }
    }, { sequelize })

    return this
  }
}
