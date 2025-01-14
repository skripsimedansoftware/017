const express = require('express');
const { authMiddleware } = require('@exzly-middlewares');

const app = express.Router();

app.get('/', authMiddleware.rejectUnauthorized, (req, res) => {
  res.json({ statysCode: 200, message: 'success' });
});

app.post('/', (req, res) => {
  res.json({ statysCode: 200, message: 'success' });
});

module.exports = app;
