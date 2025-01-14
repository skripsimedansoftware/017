/**
 * @typedef {typeof import('sequelize').Model} Model
 *
 * Sequelize model.
 *
 * @typedef {Object} DB
 * @property {import('sequelize').Sequelize} sequelize - Database.
 * @property {typeof import('sequelize').Sequelize} Sequelize - Sequelize.
 * @property {Model} ContactForm - Contact form model.
 * @property {Model} PostComment - Post comment model.
 * @property {Model} Post - Post model.
 * @property {Model} TermRelationship - Post model.
 * @property {Model} TermTaxonomy - Term taxonomy model.
 * @property {Model} Term - Term model.
 * @property {Model} User - User model.
 */

const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');

/** @type {DB} */
const db = {};
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

/**
 * @type {import('sequelize').Options}
 */
const config = require(`${__dirname}/../../database/config.json`)[env];

/**
 * @type {import('sequelize').Sequelize}
 */
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1,
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
