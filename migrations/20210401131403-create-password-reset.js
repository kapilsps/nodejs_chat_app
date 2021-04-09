'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('password_resets', {
      email: {
        allowNull:false,
        unique:true,
        type: Sequelize.STRING
      },
      token: {
        allowNull:false,
        type: Sequelize.STRING
      },
      expireAt:{
        allowNull:false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('password_resets');
  }
};