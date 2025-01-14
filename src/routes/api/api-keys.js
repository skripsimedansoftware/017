const express = require('express');
const { APIKey } = require('@exzly-models');
const { commonValidator } = require('@exzly-validators');
const { authMiddleware } = require('@exzly-middlewares');

const app = express.Router();

app.get(
  '/',
  [
    authMiddleware.rejectUnauthorized,
    authMiddleware.rejectNonAdmin,
    commonValidator.dataQuery,
  ],
  async (req, res, next) => {
    try {
      const { order, where } = APIKey.dataTablesQuery(req);

      /** @type {import('sequelize').FindAndCountOptions} */
      const queryOptions = {
        where,
        order,
        paranoid: !req.query['in-trash'],
        limit: req.query['size'],
        offset: req.query['skip'],
      };

      const { count, rows } = await APIKey.findAndCountAll(queryOptions);
      const hasNext = queryOptions.offset + rows.length < count;

      // send response
      return res
        .setHeader(
          'data-total',
          await APIKey.count({ paranoid: queryOptions.paranoid }),
        )
        .setHeader('data-filtered', count)
        .json({ data: rows, hasNext });
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = app;
