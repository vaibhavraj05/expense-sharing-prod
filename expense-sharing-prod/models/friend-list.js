"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "friendOne",
        targetKey: "id",
        as: "friendOneData"
      });
      this.belongsTo(models.User, {
        foreignKey: "friendTwo",
        targetKey: "id",
        as: "friendTwoData",
      });
    }

  }
  FriendList.init(
    {
      friendOne: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      friendTwo: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "friend_list",
      modelName: "FriendList",
    }
  );
  return FriendList;
};
