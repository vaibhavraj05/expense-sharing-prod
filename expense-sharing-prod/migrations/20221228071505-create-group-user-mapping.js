"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("group_user_mapping", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      group_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "group",
          key: "id",
        },
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
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
    await queryInterface.dropTable("group_user_mapping");
  },
};
