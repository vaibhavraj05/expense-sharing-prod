"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaction", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      expense_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "expense",
          key: "id",
        },
      },
      payee_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      payer_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      amount_to_pay: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaction");
  },
};
