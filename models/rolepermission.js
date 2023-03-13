'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // RolePermission.belongsToMany(models.Permission, {
      //   through: 'RolePermission',
      //   as: 'rolepermissions',
      //   foreignKey: 'perm_id'
      // });
      // RolePermission.belongsToMany(models.Roles, {
      //   through: 'Role_Permissions',
      //   as: 'role_permissionss',
      //   foreignKey: 'role_id'
      // });
    }
  }
  RolePermission.init({
    perm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }
    , {
    sequelize,
    modelName: 'RolePermission',
  });
  return RolePermission;
};