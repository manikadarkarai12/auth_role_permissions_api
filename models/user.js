'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {  
      User.belongsToMany(models.user_roles, {
        through: 'UsersRole',
        foreignKey: 'user_id',
        as: 'User_UsersRole'
      }); 
      // User.belongsToMany(models.GroupUser, {
      //   through: 'GroupUsers',
      //   foreignKey: 'user_id',
      //   as: 'GroupUser'
      // });
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone:  {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
