'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('uploads', 'size', {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn('uploads', 'size')
}
