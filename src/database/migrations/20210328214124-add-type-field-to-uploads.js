'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('uploads', 'type', {
      type: Sequelize.STRING,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn('uploads', 'type')
}
