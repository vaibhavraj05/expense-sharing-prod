"use strict";

const { hash } = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user", [
      {
        first_name: "Bob",
        last_name: "Jones",
        email: "bobjones@mailinator.com",
        password: await hash("Bob@123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Charlie",
        last_name: "Smith",
        email: "charliesmith@mailinator.com",
        password: await hash("Charlie@123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Ema",
        last_name: "Tailor",
        email: "ematailor@mailinator.com",
        password: await hash("Ema@123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "David",
        last_name: "Johnson",
        email: "davidjohnson@mailinator.com",
        password: await hash("David@123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Fred",
        last_name: "Watson",
        email: "fredwatson@mailinator.com",
        password: await hash("Fred@123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Gabe",
        last_name: "Styles",
        email: "gabestyles@mailinator.com",
        password: await hash("Gabe@123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
