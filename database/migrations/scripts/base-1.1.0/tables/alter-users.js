/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add column
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('active', 'non-active', 'suspended', 'banned'),
      allowNull: false,
      defaultValue: 'active',
    });
  },
  async down(queryInterface) {
    // remove column
    await queryInterface.removeColumn('users', 'status');
  },
};
