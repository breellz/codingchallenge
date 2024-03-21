'use strict';

const { GenericContainer } = require('testcontainers');

const config = require('../../src/config');

const { DB_USER, DB_PWD, DB_PORT, DB_NAME, DB_HOST } = process.env;

let dbInstance = null;
const URI = `postgres://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

async function start() {
  // Create database
  // const dbImage = await new GenericContainer('postgres', '11')
  //   .withEnv('POSTGRES_DB', DB_NAME)
  //   .withEnv('POSTGRES_USER', DB_USER)
  //   .withEnv('POSTGRES_PASSWORD', DB_PWD)
  //   .withExposedPorts(DB_PORT);
  // dbInstance = await dbImage.start();
  // Update configs
  // const dbPort = dbInstance.getMappedPort(DB_PORT);
  // const dbHost = dbInstance.getHost();
  // const URI = `postgres://${DB_USER}:${DB_PWD}@${dbHost}:${dbPort}/${DB_NAME}`;
  Object.assign(config.DB, { URI });
}

async function stop() {
  if (dbInstance) {
    await dbInstance.stop({
      removeVolumes: true,
    });
  }
}

module.exports = { start, stop, URI };
