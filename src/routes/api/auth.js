const express = require('express');
const httpErrors = require('http-errors');
const { Op } = require('sequelize');
const { SHA1 } = require('crypto-js');
const { User } = require('@exzly-models');
const { jwtSignIn } = require('@exzly-utils');
const { authValidator } = require('@exzly-validators');

const app = express.Router();

/**
 * Sign up
 */
app.post('/sign-up', [authValidator.signUp], async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });

  // send response
  return res.json({ user });
});

/**
 * Sign in
 */
app.post('/sign-in', [authValidator.signIn], async (req, res, next) => {
  const auth = await User.findOne({
    where: {
      [Op.or]: [{ email: req.body.identity }, { username: req.body.identity }],
    },
    attributes: {
      include: ['password'],
    },
  });

  if (auth === null) {
    // invalid identity
    return next(httpErrors.Unauthorized('Invalid credentials'));
  }

  if (SHA1(req.body.password).toString() !== auth.password) {
    // invalid password
    return next(httpErrors.Unauthorized('Invalid credentials'));
  }

  const user = {
    id: auth.id,
    email: auth.email,
    username: auth.username,
    isAdmin: auth.isAdmin,
    fullName: auth.fullName,
  };
  const token = jwtSignIn({ userId: auth.id });

  // create session
  req.session.userId = auth.id;

  // send response
  return res.json({ user, token });
});

/**
 * Refresh token
 */
app.post('/refresh-token', [authValidator.signIn], (req, res, next) => {
  return next();
});

/**
 * Verification code
 */
app.post('/verification-code', [authValidator.signIn], (req, res, next) => {
  return next();
});

/**
 * Forgot password
 */
app.post('/forgot-password', [authValidator.signIn], (req, res, next) => {
  return next();
});

/**
 * Reset password
 */
app.post('/reset-password', [authValidator.signIn], (req, res, next) => {
  return next();
});

module.exports = app;
