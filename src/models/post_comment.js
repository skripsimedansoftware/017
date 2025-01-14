const { Model } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      PostComment.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
      });
    }
  }

  PostComment.init(
    {
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'PostComment',
      tableName: 'post_comments',
    },
  );

  return PostComment;
};
