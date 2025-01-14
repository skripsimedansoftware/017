const { query } = require('express-validator');
const { runValidation } = require('@exzly-middlewares');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

/** @type {ExpressMiddleware[]} */
module.exports = [
  /**
   * Limit query
   */
  query('size')
    .default(10)
    .if(query('size').exists())
    .isInt({ allow_leading_zeroes: false })
    .withMessage('Must be integer')
    .isInt({ min: 0 })
    .withMessage('Must be integer 0')
    .isInt({ max: 100 })
    .withMessage('Max is 100'),

  /**
   * Offset query
   */
  query('skip')
    .default(0)
    .if(query('skip').exists())
    .isInt({ allow_leading_zeroes: false })
    .withMessage('Must be integer')
    .isInt({ min: 0 })
    .withMessage('Must be integer 0'),

  /**
   * Soft-deleted query
   */
  query('in-trash')
    .default(false)
    .if(query('in-trash').exists())
    .isBoolean()
    .withMessage('Must be a boolean'),
  runValidation,
  (req, res, next) => {
    req.query['size'] = parseInt(req.query.size);
    req.query['skip'] = parseInt(req.query.skip);
    req.query['in-trash'] = req.query['in-trash'] === 'true';
    return next();
  },
];
