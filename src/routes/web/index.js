const express = require('express');
const { sessionMiddleware, setRouteName } = require('@exzly-middlewares');
const { Post, TermRelationship, TermTaxonomy, Term } = require('@exzly-models');

const app = express.Router();

/**
 * Web middleware
 */
app.use(setRouteName('web'), sessionMiddleware);

/**
 * Web route
 */
app.get('/', (req, res) => {
  return res.render('web/index');
});

app.get('/contact', (req, res) => {
  return res.render('web/contact');
});

app.get('/search', (req, res) => {
  return res.render('web/search');
});

app.get('/sign-up', (req, res) => {
  return res.render('web/auth/sign-up');
});

app.get('/sign-in', (req, res) => {
  return res.render('web/auth/sign-in');
});

app.get('/sign-out', (req, res) => {
  return req.session.destroy(() => {
    return res.redirect(`${process.env.WEB_ROUTE}/sign-in`);
  });
});

app.get('/forgot-password', (req, res) => {
  return res.render('web/auth/forgot-password');
});

app.get('/reset-password', (req, res) => {
  return res.render('web/auth/reset-password');
});

app.get('/page/:slug', async (req, res) => {
  const page = await Post.findOne({
    where: { type: 'page', slug: req.params.slug, status: 'publish' },
  });

  return res.render('web/page', { page });
});

app.get('/blog', async (req, res) => {
  return res.render('web/blog/index');
});

app.get('/blog/category/*', async (req, res) => {
  const postsByCategory = await Post.findAndCountAll({
    include: [
      {
        as: 'termRelationships',
        model: TermRelationship,
        include: [
          {
            as: 'termTaxonomy',
            model: TermTaxonomy,
            where: { taxonomy: 'category' },
            include: [
              {
                as: 'term',
                model: Term,
                where: {
                  name: req.params.slug,
                },
              },
            ],
          },
        ],
      },
    ],
  });

  console.log({ postsByCategory });
  return res.render('web/blog/category');
});

app.get('/blog/tags/:slug?', async (req, res) => {
  return res.render('web/blog/tags');
});

app.get('/post/:slug', async (req, res) => {
  const post = await Post.findOne({
    where: { type: 'post', slug: req.params.slug },
  });

  return res.render('web/post', { post });
});

module.exports = app;
