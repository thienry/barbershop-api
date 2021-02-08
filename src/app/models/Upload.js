import Sequelize, { Model } from 'sequelize'

export default class Upload extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING
    }, { sequelize })

    return this
  }
}
