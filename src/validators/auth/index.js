const signUp = require('./sign-up');
const signIn = require('./sign-in');
const refreshToken = require('./refresh-token');
const forgotPassword = require('./forgot-password');
const resetPassword = require('./reset-password');

module.exports = {
  signUp,
  signIn,
  refreshToken,
  forgotPassword,
  resetPassword,
};
