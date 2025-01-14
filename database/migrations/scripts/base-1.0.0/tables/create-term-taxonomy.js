/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'term_taxonomy',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        count: Sequelize.INTEGER,
        taxonomy: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: Sequelize.STRING,
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('term_taxonomy');
  },
};
