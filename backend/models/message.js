"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Comment);
      models.Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Message.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
