const { Model } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'author',
        foreignKey: 'userId',
      });
    }
  }

  Post.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      comment: {
        type: DataTypes.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      status: {
        type: DataTypes.ENUM('draft', 'publish'),
        allowNull: false,
        defaultValue: 'draft',
      },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'posts',
    },
  );

  return Post;
};
