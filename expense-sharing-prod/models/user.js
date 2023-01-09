"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Transaction, {
        foreignKey: "payeeId",
        as: "TransactionsAsPayee",
      });
      this.hasMany(models.Transaction, {
        foreignKey: "payerId",
        as: "TransactionsAsPayer",
      });
      this.hasMany(models.FriendList, {
        foreignKey: "friendOne",
        as: "friendOne",
      });
      this.hasMany(models.FriendList, {
        foreignKey: "friendTwo",
        as: "friendTwo",
      });
      this.belongsToMany(models.Group, {
        through: models.GroupUserMapping,
        foreignKey: "userId",
        as: "groups",
      });
    }
  }
  User.init(
    {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "user",
      modelName: "User",
    }
  );
  return User;
};
