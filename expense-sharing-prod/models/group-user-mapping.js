"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupUserMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "user",
      });
      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        targetKey: "id",
        as: "group",
      });
    }
  }
  GroupUserMapping.init(
    {
      groupId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "group",
          key: "id",
        },
      },
      userId: {
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
      tableName: "group_user_mapping",
      modelName: "GroupUserMapping",
    }
  );
  return GroupUserMapping;
};
