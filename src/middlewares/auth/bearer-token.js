/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const httpErrors = require('http-errors');
const { header, validationResult } = require('express-validator');
const { jwtVerify } = require('@exzly-utils');

const whitelist =
  /auth\/(sign-(up|in|out)|refresh-token|(forgot|reset)-password)|verification-code/;

/** @type {ExpressMiddleware[]} */
module.exports = [
  header('authorization').custom(async (value, { req }) => {
    if (value) {
      try {
        const token = value.replace('Bearer ', '');
        const verify = jwtVerify(token);
        req.userId = verify.userId;
      } catch (error) {
        const excludePaths = whitelist.test(req.path);
        if (error.name === 'JsonWebTokenError') {
          if (!excludePaths) {
            throw new Error('Invalid token');
          }
        } else if (error.name === 'TokenExpiredError') {
          if (!excludePaths) {
            throw new Error('Token expired');
          }
        }
      }
    }

    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const asArray = errors.array();
      const findError = asArray.find((item) => item.path === 'authorization');

      if (findError) {
        return next(httpErrors.Unauthorized(findError.msg));
      }
    }

    return next();
  },
];
