module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE friend_list ADD CONSTRAINT friend_list_key UNIQUE (friend_one, friend_two);');
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query('ALTER TABLE friend_list DROP CONSTRAINT friend_list_key;');
  }
};