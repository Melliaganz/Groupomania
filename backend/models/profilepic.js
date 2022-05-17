'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profilePic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.profilePic.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        constraints: true,
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  profilePic.init({
    userId: DataTypes.INTEGER,
    profilePic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profilePic',
  });
  return profilePic;
};