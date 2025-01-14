/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const { body } = require('express-validator');
const { runValidation } = require('@exzly-middlewares');

/** @type {ExpressMiddleware[]} */
module.exports = [
  body('identity')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),
  body('password')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),
  runValidation,
];
