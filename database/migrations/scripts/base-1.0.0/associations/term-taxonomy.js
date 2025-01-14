/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add column
    await queryInterface.addColumn('term_taxonomy', 'parent', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('term_taxonomy', 'term_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // add constraint
    await queryInterface.addConstraint('term_taxonomy', {
      fields: ['parent'],
      type: 'foreign key',
      name: 'fk_term_taxonomy_parent',
      references: {
        table: 'terms',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // add constraint
    await queryInterface.addConstraint('term_taxonomy', {
      fields: ['term_id'],
      type: 'foreign key',
      name: 'fk_term_taxonomy_term_id',
      references: {
        table: 'terms',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
  async down(queryInterface) {
    // remove constraint
    await queryInterface.removeConstraint(
      'term_taxonomy',
      'fk_term_taxonomy_parent',
    );
    await queryInterface.removeConstraint(
      'term_taxonomy',
      'fk_term_taxonomy_term_id',
    );

    // remove column
    await queryInterface.removeColumn('term_taxonomy', 'parent');
    await queryInterface.removeColumn('term_taxonomy', 'term_id');
  },
};
