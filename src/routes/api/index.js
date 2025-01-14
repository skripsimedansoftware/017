const express = require('express');
const moment = require('moment-timezone');
const { setRouteName, authMiddleware } = require('@exzly-middlewares');
const { getPackageJSON } = require('@exzly-utils');
const authRoutes = require('./auth');
const postsRoutes = require('./posts');
const usersRoutes = require('./users');
const apiKeysRoutes = require('./api-keys');

const app = express.Router();

/**
 * API middleware
 */
app.use(setRouteName('api'));
app.use(
  authMiddleware.bearerToken,
  authMiddleware.getAuthorization,
  (req, res, next) => {
    const whitelist = /(sign-(up|in)|(forgot|reset)-password)/;
    const excludePaths = whitelist.test(req.path);

    if (!req.user && !excludePaths) {
      return next();
    }

    return next();
  },
);

app.get('/', (req, res) => {
  res.json({
    version: getPackageJSON().version,
    timezone: moment.tz.guess(),
  });
});

/**
 * API route
 */
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
app.use('/api-keys', apiKeysRoutes);
app.use('/test', require('./test'));

module.exports = app;
