/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'terms',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.INTEGER,
        },
        type: {
          type: Sequelize.ENUM('email', 'webpush'),
          allowNull: false,
        },
        value: {
          type: Sequelize.TEXT('medium'),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive', 'unsubscribed'),
          allowNull: false,
          defaultValue: 'active',
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('terms');
  },
};
