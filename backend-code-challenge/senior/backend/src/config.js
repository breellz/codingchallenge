'use strict';

const { PORT, API_KEY, DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

module.exports = {
  API: {
    ENDPOINTS: {
      USERS: ['/users', '/users/:slug'],
    },
    HEADERS: {
      X_API_KEY: 'x-api-key',
      X_SLUG: 'x-slug',
    },
    KEY: API_KEY,
    PORT: PORT,
    SLUGS: {
      MYSELF: 'me',
    },
  },
  STAR_WARS_API: {
    BASE_URL: 'https://swapi.dev/api',
    ENDPOINTS: {
      PEOPLE: 'people',
    },
  },
  DB: {
    URI: `postgres://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    OPTIONS: {
      LOGGING: false,
      RETRY: {
        match: [
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/,
        ],
        max: 10,
      },
    },
  },
};
