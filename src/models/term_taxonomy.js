const { Model } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class TermTaxonomy extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      this.belongsTo(models.Term, { foreignKey: 'termId', as: 'term' });
      this.belongsTo(models.TermTaxonomy, {
        foreignKey: 'parent',
        as: 'parentCategory',
      });
      this.hasMany(models.TermTaxonomy, {
        foreignKey: 'parent',
        as: 'children',
      });
    }
  }

  TermTaxonomy.init(
    {
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      taxonomy: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      parent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TermTaxonomy',
      tableName: 'term_taxonomy',
      timestamps: false,
    },
  );

  return TermTaxonomy;
};
