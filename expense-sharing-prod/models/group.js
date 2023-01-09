"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.GroupUserMapping,
        foreignKey: "groupId",
        as: "users",
      });
      this.hasMany(models.Expense, {
        foreignKey: "group_id",
        as: "expenses"
      })
    }
  }
  Group.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM,
        values: ["trip", "home", "couple", "other"],
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "group",
      modelName: "Group",
    }
  );
  return Group;
};
