'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, {
        through: 'user_roles',
        as: 'Role_UsersRole'
      });
      Role.belongsToMany(models.RolePermission, {
        through: 'Role_Permission',
        as: 'rolepermissionss',
        foreignKey: 'role_id'
      });
      Role.belongsToMany(models.GroupPermission, {
        through: 'Group_Permissions',
        as: 'grouppermissions',
        foreignKey: 'role_id'
      });
    }
  };
  Role.init({
    role_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_description:  {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
