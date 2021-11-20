/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    return queryInterface.bulkInsert('users', [
      {
        name: 'Arya Irama Wahono',
        email: 'aryairama987@gmail.com',
        password: await bcrypt.hash('aryairama', salt),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
