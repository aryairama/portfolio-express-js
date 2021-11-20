/* eslint-disable no-unused-vars */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      user_id: {
        type: DataTypes.BIGINT(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'Users',
    },
  );
  return Users;
};
