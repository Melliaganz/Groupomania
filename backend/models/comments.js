'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      })
    }
  }
  Comment.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    messageId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'comment',
  });
  return Comment;
};