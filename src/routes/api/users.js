const express = require('express');
const httpErrors = require('http-errors');
const { User } = require('@exzly-models');
const { securityConfig } = require('@exzly-config');
const { commonValidator } = require('@exzly-validators');
const { storageMiddleware, authMiddleware } = require('@exzly-middlewares');

const app = express.Router();

/**
 * Get users
 */
app.get(
  '/',
  [
    authMiddleware.rejectUnauthorized,
    authMiddleware.rejectNonAdmin,
    commonValidator.dataQuery,
  ],
  async (req, res, next) => {
    try {
      const { order, where } = User.dataTablesQuery(req);

      /** @type {import('sequelize').FindAndCountOptions} */
      const queryOptions = {
        where,
        order,
        paranoid: !req.query['in-trash'],
        limit: req.query['size'],
        offset: req.query['skip'],
      };
      const { count, rows } = await User.findAndCountAll(queryOptions);
      const hasNext = queryOptions.offset + rows.length < count;

      // send response
      return res
        .setHeader(
          'X-Total-Count',
          await User.count({ paranoid: !req.query['in-trash'] }),
        )
        .setHeader('X-Filtered-Count', count)
        .json({ data: rows, hasNext });
    } catch (error) {
      return next(error);
    }
  },
);

/**
 * Create user
 */
app.post(
  '/',
  [authMiddleware.rejectUnauthorized, authMiddleware.rejectNonAdmin],
  (req, res, next) => {
    return next();
  },
);

/**
 * View user profile
 */
app.get('/profile/:id?', async (req, res, next) => {
  const user = await User.findByPk(req.params.id || req.userId);

  if (!user) {
    // send error : not found
    return next(httpErrors.NotFound('User not found'));
  }

  // send response
  return res.json({ data: user });
});

app.put('/profile/:id?', async (req, res, next) => {
  const user = await User.findByPk(req.params.id || req.userId);

  if (!user) {
    // send error : not found
    return next(httpErrors.NotFound('User not found'));
  }

  if (user.id !== req.userId && !req.user.isAdmin) {
    // send error : permission denied
    return next(httpErrors.Forbidden('Permission denied'));
  }

  return res.json({ data: user });
});

/**
 * Update user profile
 */
app.put('/profile/:id', async (req, res, next) => {
  // const user = await User.findByPk(req.params.id);
  return next();
});

/**
 * Change or remove user photo profile
 */
app.put(
  '/profile/:id/photo',
  [
    storageMiddleware.diskStorage('user-photos').single('photo'),
    storageMiddleware.validateFileMimes(securityConfig.allowedImageMimeTypes),
  ],
  async (req, res, next) => {
    if (!req.file && !req.query.remove) {
      // send error : photo profile or remove is required
      return next(httpErrors.BadRequest('Profile photo is required'));
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      // send error : not found
      return next(httpErrors.NotFound('User not found'));
    }

    if (user.id !== req.userId && !req.user.isAdmin) {
      // send error : permission denied
      return next(httpErrors.Forbidden('Permission denied'));
    }

    if (req.file) {
      await user.update({ photo_profile: req.file.path });
    }

    if (req.query.remove === 'true') {
      await user.update({ photo_profile: null });
    }

    // send response
    return res.json({ statusCode: 200 });
  },
);

/**
 * Delete user
 */
app.delete(
  '/profile/:id',
  [
    authMiddleware.rejectUnauthorized,
    authMiddleware.rejectNonAdmin,
    commonValidator.dataQuery,
  ],
  async (req, res, next) => {
    const user = await User.findByPk(req.params.id, {
      paranoid: !req.query['in-trash'],
    });

    if (!user) {
      // send error : not found
      return next(httpErrors.NotFound('User not found'));
    }

    await user.destroy({ force: req.query['in-trash'] });

    // send response
    return res.json({ statusCode: 200 });
  },
);

/**
 * Restore user
 */
app.patch(
  '/profile/:id',
  [authMiddleware.rejectUnauthorized, authMiddleware.rejectNonAdmin],
  async (req, res, next) => {
    const user = await User.findByPk(req.params.id, {
      paranoid: false,
    });

    if (!user) {
      // send error : not found
      return next(httpErrors.NotFound('User not found'));
    }

    await user.restore();

    // send response
    return res.json({ statusCode: 200 });
  },
);

module.exports = app;
