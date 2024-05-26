"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Message, { foreignKey: "userId" });
      User.hasMany(models.Comment, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      imageUrl: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      password: DataTypes.STRING,
      admin: DataTypes.BOOLEAN,
      emailHash: DataTypes.STRING,
      lock_until: DataTypes.STRING,
      login_attempts: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
