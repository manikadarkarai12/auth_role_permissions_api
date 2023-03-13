'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    static associate(models) {
      Groups.belongsToMany(models.GroupUser, {
        through: 'GroupUsers',
        as: 'groupusers',
        foreignKey: 'group_id'
      });
      Groups.belongsToMany(models.GroupPermission, {
        through: 'Group_Permission',
        as: 'grouppermission',
        foreignKey: 'group_id'
      });
    }
  };
  Groups.init({
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group_description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    }, {
    sequelize,
    modelName: 'Groups',
  });
  return Groups;
};
