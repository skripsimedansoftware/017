/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const { body } = require('express-validator');
const { runValidation } = require('@exzly-middlewares');

/**
 * @type {ExpressMiddleware[]}
 */
module.exports = [
  body('refresh_token')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a string'),
  runValidation,
];
