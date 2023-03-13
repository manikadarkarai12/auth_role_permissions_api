'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.RolePermission, {
        through: 'Role_Permission',
        as: 'role_perm',
        foreignKey: 'perm_id'
      });
    }
  };
  Permission.init({
    perm_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    perm_description:  {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};