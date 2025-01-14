const { body } = require('express-validator');

module.exports = {
  full_name: body('full_name')
    .notEmpty()
    .withMessage('Full name can not be empty')
    .isString()
    .withMessage('Full name must be a string'),
  username: body('username')
    .custom((value) => {
      const regex =
        /^[a-zA-Z0-9](?!.*?[._]{2})[a-zA-Z0-9._]{0,28}[a-zA-Z0-9]$/u;
      return regex.test(value);
    })
    .withMessage('Username has an invalid format'),
};
