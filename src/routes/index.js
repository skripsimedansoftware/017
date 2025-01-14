const express = require('express');

const cors = require('cors');
const morgan = require('morgan');
const httpErrors = require('http-errors');
const compression = require('compression');
const {
  viewEngineMiddleware,
  fileLoaderMiddleware,
} = require('@exzly-middlewares');
const apiRoutes = require('./api');
const webRoutes = require('./web');
const adminRoutes = require('./admin');
const apiErrorHandler = require('./api/error');
const webErrorHandler = require('./web/error');
const adminErrorHandler = require('./admin/error');

const app = express();

/**
 * Set view engine & proxy
 */
app.set('trust proxy', true);
app.set('view engine', 'njk');
app.use(viewEngineMiddleware);

/**
 * Global middleware
 */
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(
  '/storage/user-photos/:file',
  fileLoaderMiddleware.imageLoader.diskStorage('user-photos'),
);

/**
 * Set routes
 */
app.use(process.env.WEB_ROUTE, webRoutes);
app.use(process.env.API_ROUTE, apiRoutes);
app.use(process.env.ADMIN_ROUTE, adminRoutes);

/**
 * Handle 404 route path
 */
app.use((req, res, next) => next(httpErrors.NotFound('Route not found')));

/**
 * Error handler by base routes
 */
app.use((err, req, res, next) => {
  switch (req.routeName) {
    case 'web':
      return webErrorHandler(err, req, res, next);

    case 'api':
      return apiErrorHandler(err, req, res, next);

    case 'admin':
      console.log(err);
      return adminErrorHandler(err, req, res, next);

    default:
      return next(err);
  }
});

module.exports = app;
