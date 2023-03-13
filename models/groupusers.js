'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // GroupUsers.belongsToMany(models.Users, {
      //   through: 'Users',
      //   as: 'users',
      //   foreignKey: 'user_id'
      // });
      // GroupUsers.belongsToMany(models.Groups, {
      //   through: 'Group_Users',
      //   as: 'groupusers',
      //   foreignKey: 'group_id'
      // });
    }
  }
  GroupUser.init({
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GroupUser',
  });
  return GroupUser;
};
