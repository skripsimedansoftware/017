const moment = require('moment');
const { SHA1 } = require('crypto-js');
const { faker } = require('@faker-js/faker');

let lastDate = moment().subtract(1, 'years');
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

    /**
     * Generate users as member
     *
     * @type {UserAttributes[]}
     */
    const users = defaultUsers.concat(
      [...Array(998)].map(() => {
        const sexType = faker.person.sexType();
        const firstName = faker.person.firstName(sexType);
        const lastName = faker.person.lastName(sexType);
        const fullName = faker.person.fullName({
          firstName,
          lastName,
          sex: sexType,
        });
        const email = faker.internet
          .email({ firstName, lastName })
          .toLowerCase();
        const username = faker.internet
          .username({ firstName, lastName })
          .substring(0, 30)
          .toLowerCase();
        const password = SHA1('member').toString();
        const photo_profile = faker.image.url({ height: 200, width: 200 });

        lastDate = lastDate.clone().add(8.8, 'hours');

        return {
          email,
          username,
          password,
          is_admin: false,
          gender: sexType,
          full_name: fullName,
          photo_profile,
          created_at: lastDate.toDate(),
          updated_at: lastDate.toDate(),
        };
      }),
    );

    // Insert users data
    await queryInterface.bulkInsert('users', users);
  },
  async down(queryInterface) {
    // Delete users data
    await queryInterface.bulkDelete('users', null, {
      truncate: true,
    });
  },
};
