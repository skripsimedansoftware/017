const { body } = require('express-validator');

module.exports = [
  body('slug').optional().isString().withMessage('Slug must be a string'),
  body('title')
    .notEmpty()
    .withMessage('Title can not be empty')
    .isString()
    .withMessage('Title must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Content can not be empty')
    .isString()
    .withMessage('Content must be a string'),
];
