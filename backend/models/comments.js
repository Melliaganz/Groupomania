'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'userId',
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      });

      models.Comment.belongsTo(models.Message, {
        foreignKey: {
          allowNull: false,
          name: 'messageId',
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }

  Comment.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};
