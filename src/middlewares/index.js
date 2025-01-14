/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const ms = require('ms');
const session = require('express-session');
const httpErrors = require('http-errors');
const FileStore = require('session-file-store')(session);
const { validationResult } = require('express-validator');
const authMiddleware = require('./auth');
const viewEngineMiddleware = require('./view-engine');
const fileLoaderMiddleware = require('./file-loader');
const storageMiddleware = require('./storage');

/**
 * Session
 */
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
  cookie: {
    path: '/',
    maxAge: ms(process.env.SESSION_EXPIRATION),
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  },
});

/**
 * Admin session
 *
 * @type {ExpressMiddleware}
 */
const adminSession = (req, res, next) => {
  if (!req.session?.user) {
    const whitelist =
      /(sign-(in|out)|(forgot|reset)-password)|verification-code/;
    const excludePaths = whitelist.test(req.path);
    if (!excludePaths) {
      return res.redirect(`${req.baseUrl}/sign-in`);
    }

    return next();
  } else if (req.session.user) {
    if (!req.session.user.is_admin) {
      return next(httpErrors.Forbidden('Permission denied'));
    }
  }

  return next();
};

/**
 * Run validation
 *
 * @type {ExpressMiddleware}
 */
const runValidation = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(httpErrors.BadRequest('validation'));
  }

  return next();
};

/**
 * Set route name
 *
 * @param {string} name
 * @returns {ExpressMiddleware}
 */
const setRouteName = (name) => (req, res, next) => {
  req.routeName = name;
  return next();
};

module.exports = {
  setRouteName,
  adminSession,
  runValidation,
  authMiddleware,
  sessionMiddleware,
  fileLoaderMiddleware,
  viewEngineMiddleware,
  storageMiddleware,
};
