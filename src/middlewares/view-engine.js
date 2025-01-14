/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const moment = require('moment');
const lodash = require('lodash');
const nunjucks = require('nunjucks');
const { viewEngineHelper } = require('@exzly-helpers');
const { getPackageJSON } = require('@exzly-utils');

/**
 * @type {ExpressMiddleware}
 */
module.exports = (req, res, next) => {
  const viewEngine = nunjucks.configure('src/views', {
    autoescape: false,
    express: req.app,
    watch: true,
  });

  /**
   * Custom function
   */
  viewEngine.addGlobal('_', lodash);
  viewEngine.addGlobal('moment', moment);
  viewEngine.addGlobal('apiRoute', (path = '') => process.env.API_ROUTE + path);
  viewEngine.addGlobal('webRoute', (path = '') => process.env.WEB_ROUTE + path);
  viewEngine.addGlobal(
    'adminRoute',
    (path = '') => process.env.ADMIN_ROUTE + path,
  );
  viewEngine.addGlobal('getQueryParams', (key = undefined) => {
    return viewEngineHelper.getQueryParams(req, key);
  });
  viewEngine.addGlobal('uriSegments', () => {
    return viewEngineHelper.uriSegments(req);
  });
  viewEngine.addGlobal('uriSegmentMatches', (text, num = 0) => {
    return viewEngineHelper.uriSegmentMatches(req, text, num);
  });

  /**
   * Custom variable
   */
  viewEngine.addGlobal('req', req);
  viewEngine.addGlobal('app_name', process.env.APP_NAME);
  viewEngine.addGlobal('environment', process.env.NODE_ENV);
  viewEngine.addGlobal('version', getPackageJSON().version);
  viewEngine.addGlobal(
    'reqURL',
    new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`),
  );
  viewEngine.addGlobal(
    'isBasePath',
    req.path.split('/').filter((item) => item !== '').length === 1,
  );

  /**
   * Custom filter
   */
  viewEngine.addFilter(
    'json',
    async (input, callback) => {
      if (input instanceof Promise) {
        const result = await input;
        callback(null, JSON.stringify(result));
      } else {
        callback(null, JSON.stringify(input));
      }
    },
    true,
  );

  return next();
};
