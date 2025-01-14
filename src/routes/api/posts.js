const express = require('express');
const { Op } = require('sequelize');
const httpErrors = require('http-errors');
const { Post } = require('@exzly-models');
const { authMiddleware } = require('@exzly-middlewares');
const { commonValidator, postValidator } = require('@exzly-validators');

const app = express.Router();

/**
 * Get all posts
 */
app.get(
  '/',
  [
    authMiddleware.rejectUnauthorized,
    authMiddleware.rejectNonAdmin,
    commonValidator.dataQuery,
  ],
  async (req, res) => {
    const posts = await Post.findAndCountAll();

    // send response
    return res.json({ data: posts });
  },
);

/**
 * Create a post
 */
app.post(
  '/',
  [
    authMiddleware.rejectUnauthorized,
    authMiddleware.rejectNonAdmin,
    postValidator.create,
  ],
  async (req, res) => {
    const post = await Post.create(req.body);

    // send response
    return res.json({ data: post });
  },
);

/**
 * Search posts
 */
app.get('/search', async (req, res) => {
  const posts = await Post.findAll({
    where: {
      title: {
        [Op.substring]: req.query.q,
      },
      status: 'published',
    },
  });

  // send response
  return res.json({ data: posts });
});

app.get('/categories', async (req, res) => {
  return res.json({ statusCode: 200 });
});

/**
 * Get a post by slug
 */
app.get('/:slug', async (req, res, next) => {
  const post = await Post.findOne({ where: { slug: req.params.slug } });

  if (!post) {
    // send error : not found
    return next(httpErrors.NotFound('Post not found'));
  }

  // send response
  return res.json({ data: post });
});

/**
 * Update a post
 */
app.put('/:id', async (req, res, next) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    // send error : not found
    return next(httpErrors.NotFound('Post not found'));
  }

  await Post.update(req.body);

  // send response
  return res.json({ statusCode: 200 });
});

/**
 * Delete a post
 */
app.delete('/:id', async (req, res, next) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    // send error : not found
    return next(httpErrors.NotFound('Post not found'));
  }

  // send response
  return res.json({ statusCode: 200 });
});

// app.put('/:postId');

module.exports = app;
