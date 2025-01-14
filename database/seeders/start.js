const moment = require('moment');
const { SHA1 } = require('crypto-js');

const startDate = moment().subtract(1, 'years');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    /**
     * Generate users as admin
     *
     * @type {UserAttributes[]}
     */
    const defaultUsers = [
      {
        email: 'admin@example.demo',
        username: 'admin',
        password: SHA1('admin').toString(),
        is_admin: true,
        full_name: 'Administrator',
        created_at: startDate.toDate(),
        updated_at: startDate.toDate(),
      },
      {
        email: 'member@example.demo',
        username: 'member',
        password: SHA1('member').toString(),
        is_admin: false,
        full_name: 'Member',
        created_at: startDate.toDate(),
        updated_at: startDate.toDate(),
      },
    ];

    // Insert users data
    await queryInterface.bulkInsert('users', defaultUsers);
  },
  async down(queryInterface) {
    // Delete users data
    await queryInterface.bulkDelete('users', null, {
      truncate: true,
    });
  },
};
