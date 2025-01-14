/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(err: any, req: Request, res: Response, next: NextFunction) => void} ExpressErrorHandler
 */

const httpErrors = require('http-errors');
const { validationResult } = require('express-validator');
const { MulterError } = require('multer');
const { BaseError } = require('sequelize');

/** @type {ExpressErrorHandler} */
module.exports = (err, req, res, next) => {
  if (!httpErrors.isHttpError(err)) {
    console.error('Error :', err);
  }

  /**
   * Error format
   */
  const errorFormat = {
    statusCode: 500,
    message: err.message, // error message
    data: undefined, // error info
  };

  if (!res.headersSent) {
    /**
     * Http errors
     */
    if (httpErrors.isHttpError(err)) {
      // set to error format
      errorFormat.statusCode = err.status;
      errorFormat.message = err.message;

      // * 400 - Bad request
      if (err.status === 400) {
        // Invalid JSON format
        if (err.message.match(/.* in JSON at position \d+/)) {
          errorFormat.message = err.message;
        }

        // Validation middleware
        if (err.message === 'validation') {
          errorFormat.message = 'Validation error';
          errorFormat.data = validationResult(req)
            .array({ onlyFirstError: true })
            .map((item) => ({
              type: item.type,
              path: item.path,
              location: item.location,
              message: item.msg,
              nest: item.nestedErrors,
            }));
        }
      }

      // send response
      return res.status(errorFormat.statusCode).json(errorFormat);
    }

    /**
     * Multer error
     */
    if (err instanceof MulterError) {
      errorFormat.statusCode = 400;
      errorFormat.message = 'Unexpected file';

      // send response
      return res.status(errorFormat.statusCode).json(errorFormat);
    }

    /**
     * Sequelize error
     */
    if (err instanceof BaseError) {
      errorFormat.message =
        process.env.NODE_ENV === 'development'
          ? err?.parent?.message
          : 'Database error';

      // send response
      return res.status(errorFormat.statusCode).json(errorFormat);
    }

    /**
     * Error instance
     */
    if (err instanceof Error) {
      // send response
      return res.status(errorFormat.statusCode).json(errorFormat);
    }
  }

  return next(err);
};
