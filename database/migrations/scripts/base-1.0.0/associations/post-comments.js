/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add column
    await queryInterface.addColumn('post_comments', 'post_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn('post_comments', 'parent_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // add constraint
    await queryInterface.addConstraint('post_comments', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'fk_post_comments_post_id',
      references: {
        table: 'posts',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('post_comments', {
      fields: ['parent_id'],
      type: 'foreign key',
      name: 'fk_post_comments_parent_id',
      references: {
        table: 'post_comments',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
  async down(queryInterface) {
    // remove constraint
    await queryInterface.removeConstraint(
      'post_comments',
      'fk_post_comments_post_id',
      'fk_post_comments_parent_id',
    );

    // remove column
    await queryInterface.removeColumn('post_comments', 'post_id');
    await queryInterface.removeColumn('post_comments', 'parent_id');
  },
};
