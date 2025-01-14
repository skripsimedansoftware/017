/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'visitors',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        uid: Sequelize.STRING,
        is_bot: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_mobile: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        platforms: Sequelize.STRING,
        user_agents: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('visitors');
  },
};
