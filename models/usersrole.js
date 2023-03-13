'use strict';
const User = require("./user.js");
const Role = require("./role.js");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersRole extends Model {   
    static associate(models) {
      UsersRole.belongsToMany(models.User, {     
        through: 'UsersRole',  
        foreignKey: 'user_id',
        as:"User_UsersRole"
      });
      // UsersRole.belongsTo(models.Role, {       
      //   foreignKey: 'role_id'
      // });
    }
  }
  UsersRole.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model:User,
        key: "id"
    }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id"
    }
    }
  }, {
    sequelize,
    modelName: 'user_roles',
  });
  return UsersRole;
};