const { Model } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class TermRelationship extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      this.belongsTo(models.TermTaxonomy, {
        foreignKey: 'termTaxonomyId',
        as: 'taxonomy',
      });
    }
  }

  TermRelationship.init(
    {
      objectId: DataTypes.INTEGER,
      termTaxonomyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'TermRelationship',
      tableName: 'term_relationships',
      timestamps: false,
    },
  );

  return TermRelationship;
};
