"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Message.hasMany(models.Comment, { foreignKey: "messageId", onDelete: "CASCADE" });
      Message.hasMany(models.Like, { foreignKey: "messageId", onDelete: "CASCADE" });
    }
  }

  Message.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Assurez-vous que userId ne peut pas être null
      },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
