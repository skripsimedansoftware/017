const express = require('express');
const { Op } = require('sequelize');
const httpErrors = require('http-errors');
const {
  sessionMiddleware,
  setRouteName,
  authMiddleware,
} = require('@exzly-middlewares');
const { User } = require('@exzly-models');

const app = express.Router();

/**
 * Admin middleware
 */
app.use(
  setRouteName('admin'),
  sessionMiddleware,
  authMiddleware.getAuthorization,
  (req, res, next) => {
    const whitelist = /(sign-(in)|(forgot|reset)-password)/;
    const regexPath = whitelist.test(req.path);

    if (req.user && regexPath) {
      return res.redirect(`${process.env.ADMIN_ROUTE}`);
    } else if (!req.user && !regexPath) {
      return res.redirect(`${process.env.ADMIN_ROUTE}/sign-in`);
    }

    return next();
  },
);

/**
 * Admin route
 */
app.get('/', (req, res) => {
  return res.render('admin/index');
});

app.get('/sign-in', (req, res) => {
  return res.render('admin/auth/sign-in');
});

app.get('/reset-password', (req, res) => {
  return res.render('admin/auth/reset-password');
});

app.get('/sign-out', (req, res) => {
  return req.session.destroy(() => {
    return res.redirect(`${process.env.ADMIN_ROUTE}/sign-in`);
  });
});

app.get('/forgot-password', (req, res) => {
  return res.render('admin/auth/forgot-password');
});

app.get('/contact', (req, res) => {
  return res.render('admin/contact');
});

app.get('/posts', (req, res) => {
  return res.render('admin/posts/index');
});

app.get('/pages', (req, res) => {
  return res.render('admin/pages/index');
});

app.get('/pages/new', (req, res) => {
  return res.render('admin/pages/add-new');
});

app.get('/pages/:id/edit', (req, res) => {
  return res.render('admin/pages/edit');
});

app.get('/posts/new', (req, res) => {
  return res.render('admin/posts/add-new');
});

app.get('/posts/comments', (req, res) => {
  return res.render('admin/posts/comments');
});

app.get('/posts/categories', (req, res) => {
  return res.render('admin/posts/categories');
});

app.get('/posts/tags', (req, res) => {
  return res.render('admin/posts/tags');
});

app.get('/posts/:id/comments', (req, res) => {
  return res.render('admin/posts/comments');
});

app.get('/posts/:id/edit', (req, res) => {
  return res.render('admin/posts/edit');
});

app.get('/users', async (req, res) => {
  return res.render('admin/users/index', {
    deletedCount: await User.count({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    }),
  });
});

app.get('/users/add', (req, res) => {
  return res.render('admin/users/add-new');
});

app.get('/users/profile/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(httpErrors.NotFound('User not found'));
  }

  return res.render('admin/users/profile', { user });
});

module.exports = app;
