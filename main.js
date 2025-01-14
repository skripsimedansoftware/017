require('dotenv/config');
require('module-alias/register');

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const CLITable3 = require('cli-table3');
const listEndpoints = require('express-list-endpoints');

let server;
const { sequelize } = require('@exzly-models');
const routes = require('./src/routes');

if (process.env.ENABLE_SSL === 'true') {
  const key = fs.readSync(process.env.SSL_KEY_FILE);
  const cert = fs.readSync(process.env.SSL_CERT_FILE);
  server = https.createServer({ key, cert }, routes);
} else {
  server = http.createServer(routes);
}

server.on('listening', async () => {
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({
      [process.env.DB_MODE]: process.env.DB_SYNC === 'true',
    });
  }

  const endpoints = listEndpoints(routes);
  const endpointsTable = new CLITable3({
    head: ['Methods', 'Path', 'Middleware'],
  });

  const loadEndpoint = (e = 0) => {
    if (e < endpoints.length) {
      endpointsTable.push([
        endpoints[e].methods.join('|'),
        endpoints[e].path,
        endpoints[e].middlewares.length,
      ]);
      loadEndpoint(e + 1);
    }
  };

  loadEndpoint();
  console.log(endpointsTable.toString());
});

server.listen(process.env.PORT ?? 3000);
