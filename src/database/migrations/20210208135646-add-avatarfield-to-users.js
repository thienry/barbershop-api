'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'uploads', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'avatar_id')
}
