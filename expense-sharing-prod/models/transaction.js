"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "payeeId",
        targetKey: "id",
        as: "payeeUser",
      });
      this.belongsTo(models.User, {
        foreignKey: "payerId",
        targetKey: "id",
        as: "payerUser",
      });
      this.belongsTo(models.Expense, {
        foreignKey: "expenseId",
        targetKey: "id",
        as: "expense",
      });
    }
  }
  Transaction.init(
    {
      expenseId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "expense",
          key: "id",
        },
      },
      payeeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      payerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      amountToPay: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "transaction",
      modelName: "Transaction",
    }
  );
  return Transaction;
};
