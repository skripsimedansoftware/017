const { Model } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class Term extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      this.hasOne(models.TermTaxonomy, {
        foreignKey: 'termId',
        as: 'taxonomy',
      });
    }
  }

  Term.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Term',
      tableName: 'terms',
      timestamps: false,
    },
  );

  return Term;
};
