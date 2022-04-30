'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        constraints: true,
        onDelete: 'CASCADE',
        hooks: true,
      },
      name: {
        type: Sequelize.STRING
      },
      messageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Messages",
          key: "id",
        },
        constraints: true,
        onDelete: 'CASCADE',
        hooks: true,
      },
      text: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};