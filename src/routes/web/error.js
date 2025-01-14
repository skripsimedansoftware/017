/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(err: any, req: Request, res: Response, next: NextFunction) => void} ExpressErrorHandler
 */

const fs = require('node:fs');
const path = require('node:path');
const httpErrors = require('http-errors');

/** @type {ExpressErrorHandler} */
module.exports = (err, req, res, next) => {
  if (!res.headersSent) {
    if (httpErrors.isHttpError(err)) {
      const errorView = `web/errors/${err.status}.njk`;

      if (fs.existsSync(path.join(process.cwd(), 'src/views', errorView))) {
        return res
          .status(err.status)
          .render(`web/errors/${err.status}.njk`, { error: err });
      }

      return res
        .status(err.status)
        .render(`web/errors/default.njk`, { error: err });
    }

    return res.status(500).render(`web/errors/default.njk`, { error: err });
  }

  return next(err);
};
