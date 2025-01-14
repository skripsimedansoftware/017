/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const { body } = require('express-validator');
const { runValidation } = require('@exzly-middlewares');

/** @type {ExpressMiddleware[]} */
const validateResetPassword = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
  runValidation,
];

module.exports = validateResetPassword;
