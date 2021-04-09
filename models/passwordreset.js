'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PasswordReset.init({
    email: {
      allowNull:false,
      unique:true,
      type: DataTypes.STRING
    },
    token: {
      allowNull:false,
      type: DataTypes.STRING
    },
    expireAt:{
      allowNull:false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    tableName:'password_resets',
    modelName: 'PasswordReset',
    updatedAt:false,
  });
  PasswordReset.removeAttribute('id');
  return PasswordReset;
};