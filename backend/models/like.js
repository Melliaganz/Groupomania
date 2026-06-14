"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
      Like.belongsTo(models.Message, { foreignKey: "messageId", onDelete: "CASCADE" });
      Like.belongsTo(models.Comment, { foreignKey: "commentId", onDelete: "CASCADE" });
    }
  }

  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Like",
      indexes: [
        { unique: true, fields: ["userId", "messageId"] },
        { unique: true, fields: ["userId", "commentId"] },
      ],
    }
  );

  return Like;
};
