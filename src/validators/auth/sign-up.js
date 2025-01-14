/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const { body } = require('express-validator');

/** @type {ExpressMiddleware[]} */
module.exports = [
  body('email')
    .notEmpty()
    .withMessage('This field can not be empty')
    .isString()
    .withMessage('This field must be a string')
    .isEmail()
    .withMessage('This field must be a valid email'),
  body('username')
    .notEmpty()
    .withMessage('This field can not be empty')
    .isString()
    .withMessage('This field must be a string')
    .custom((value) => {
      const regex =
        /^[a-zA-Z0-9](?!.*?[._]{2})[a-zA-Z0-9._]{0,28}[a-zA-Z0-9]$/u.test(
          value,
        );
      return regex;
    })
    .withMessage('This field has an invalid username format'),
  body('password')
    .notEmpty()
    .withMessage('This field can not be empty')
    .isString()
    .withMessage('This field must be a string'),
  body('full_name')
    .notEmpty()
    .withMessage('This field can not be empty')
    .isString()
    .withMessage('This field must be a string'),
];
