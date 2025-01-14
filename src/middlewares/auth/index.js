/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const httpErrors = require('http-errors');
const { User } = require('@exzly-models');
const bearerToken = require('./bearer-token');

/**
 * Authorize
 *
 * @type {ExpressMiddleware}
 */
const getAuthorization = async (req, res, next) => {
  const userId = req.userId || req.session.userId;

  if (userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      req.userId = null;
      return req.session.destroy((err) => {
        if (err) {
          return next(err);
        }

        return next();
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      fullName: user.fullName,
    };
  }

  return next();
};

/**
 * Reject Unauthorized
 *
 * @type {ExpressMiddleware}
 */
const rejectUnauthorized = (req, res, next) => {
  if (!req.user) {
    return next(httpErrors.Unauthorized());
  }

  return next();
};

/**
 * Reject Non Admin
 *
 * @type {ExpressMiddleware}
 */
const rejectNonAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(httpErrors.Forbidden());
  }

  return next();
};

module.exports = {
  bearerToken,
  getAuthorization,
  rejectUnauthorized,
  rejectNonAdmin,
};
