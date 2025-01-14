/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add column
    await queryInterface.addColumn('posts', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // add constraint
    await queryInterface.addConstraint('posts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_posts_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
  async down(queryInterface) {
    // remove constraint
    await queryInterface.removeConstraint('posts', 'fk_posts_user_id');

    // remove column
    await queryInterface.removeColumn('posts', 'user_id');
  },
};
