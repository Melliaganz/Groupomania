'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association with User model
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      });

      // Association with Message model
      models.Comment.belongsTo(models.Message, {
        foreignKey: {
          allowNull: false,
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }

  // Initialize Comment model with attributes
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
