'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupPermission extends Model {   
    static associate(models) {
      // GroupPermission.belongsToMany(models.Groups, {
      //   through: 'Group_Permission',
      //   as: 'grouppermission',
      //   foreignKey: 'group_id'
      // });
      // GroupPermission.belongsToMany(models.Roles, {
      //   through: 'Group_Permissions',
      //   as: 'grouppermissions',
      //   foreignKey: 'role_id'
      // });
    }
  };
  GroupPermission.init({
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    },{
    sequelize,
    modelName: 'GroupPermission',
  });
  return GroupPermission;
};