const { SHA1 } = require('crypto-js');
const { Model, Op } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      this.hasMany(models.Post);
    }

    /**
     * Data tables query
     *
     * @param {import('express').Request} req
     */
    static dataTablesQuery(req) {
      const order = [];
      const where = {};

      /**
       * Order query
       */
      if (Object.hasOwn(req.query, 'order')) {
        if (typeof req.query.order[0] !== 'undefined') {
          if (req.query.order[0]?.column && req.query.order[0]?.dir) {
            if (req.query?.columns[req.query.order[0].column]) {
              const orderType =
                ['asc', 'desc'].indexOf(req.query.order[0].dir) !== -1
                  ? req.query.order[0].dir
                  : 'asc';
              const orderColumn = req.query.columns[req.query.order[0].column];
              const fieldsName = User.getAttributes();
              if (Object.keys(fieldsName).indexOf(orderColumn?.name) !== -1) {
                order.push([orderColumn.name, orderType]);
              }
            }
          }
        }
      }

      /**
       * Search query
       */
      if (Object.hasOwn(req.query, 'search')) {
        const { search } = req.query;
        if (search?.value && search.value.length > 0) {
          if (search?.regex === 'true') {
            // todo : Search by RegEx
          } else {
            Object.assign(where, {
              [Op.or]: [
                {
                  username: {
                    [Op.eq]: search.value,
                  },
                },
                {
                  fullName: {
                    [Op.substring]: search.value,
                  },
                },
              ],
            });
          }
        }
      }

      /**
       * Individual search
       */
      if (
        Object.hasOwn(req.query, 'columns') &&
        Array.isArray(req.query.columns)
      ) {
        for (let i = 0; i < req.query.columns.length; i++) {
          if (typeof req.query.columns[i] === 'object') {
            const column = req.query.columns[i];
            if (
              Object.hasOwn(column, 'name') &&
              Object.hasOwn(column, 'search')
            ) {
              if (
                column['search']?.value &&
                column['search'].value.length > 0
              ) {
                if (column['search']?.regex === 'true') {
                  // todo : Search by RegEx
                } else {
                  const fieldsName = User.getAttributes();
                  if (Object.keys(fieldsName).indexOf(column['name']) !== -1) {
                    Object.assign(where, {
                      [column['name']]: {
                        [Op.eq]: column['search'].value,
                      },
                    });
                  }
                }
              }
            }
          }
        }
      }

      /**
       * Trashed data
       */
      if (req.query['in-trash']) {
        Object.assign(where, {
          deletedAt: { [Op.not]: null },
        });
      }

      return { order, where };
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('email', value ? value.toLowerCase() : null);
        },
      },
      username: {
        type: DataTypes.STRING(30),
        set(value) {
          this.setDataValue('username', value ? value.toLowerCase() : null);
        },
      },
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('password', value ? SHA1(value).toString() : null);
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photoProfile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      defaultScope: {
        attributes: {
          exclude: ['password'],
        },
      },
    },
  );

  return User;
};
