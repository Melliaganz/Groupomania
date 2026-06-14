"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Likes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      messageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Messages", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Comments", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("Likes", ["userId", "messageId"], {
      unique: true,
      name: "likes_user_message_unique",
    });
    await queryInterface.addIndex("Likes", ["userId", "commentId"], {
      unique: true,
      name: "likes_user_comment_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Likes");
  },
};
