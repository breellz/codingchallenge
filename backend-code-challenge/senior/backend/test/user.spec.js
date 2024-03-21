'use strict';

require('dotenv').config({ path: `${__dirname}/test.env` });
const { Pool } = require('pg');
const request = require('supertest');
const { URI } = require('./helpers/database');
jest.mock('../src/config');

const {
  API: { KEY },
} = require('../src/config');

const pool = new Pool({
  connectionString: URI,
});

describe.skip('User Resource', () => {
  let database = null;
  let server = null;

  let agent = null;

  beforeAll(async () => {
    database = require('./helpers/database');
    await database.start();
    server = require('../src/server');
    const app = await server.start();
    agent = request.agent(app);
    agent.set({ 'x-api-key': KEY });
  });

  beforeEach(async () => {
    // Connect to the database and delete all users
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM "users";');
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await server.stop();
    // disconnect pool
    await pool.end();
    await database.stop();
  });

  describe('List Operation - GET /users', () => {
    test('should return emptry array', async () => {
      const res = await agent.get('/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
    test('should return error if user slug is missing', async () => {
      const res = await agent.get('/users/me');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Missing user slug');
    });
    test('should return error if user not found', async () => {
      const res = await agent.get('/users/unknown');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Not Found');
    });
    test('should return user details', async () => {
      const client = await pool.connect();
      try {
        await client.query(`
          INSERT INTO "users" ("id", "slug", "favourites", "createdAt", "updatedAt")
          VALUES (1, 'senior-candidate', ARRAY ['1'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `);
      } finally {
        client.release();
      }

      const res = await agent.get('/users/me').set({ 'x-api-key': KEY, 'x-slug': 'c2VuaW9yLWNhbmRpZGF0ZQ==' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.slug).toEqual('senior-candidate');
      expect(res.body.favourites).toEqual(['1']);
      expect(res.body.favouritesDetails).toBeDefined();
      expect(res.body.favouritesDetails[0].name).toEqual('Luke Skywalker');
    });
  });
  describe(' - PUT /users', () => {
    test('should return error if user slug is missing', async () => {
      const res = await agent.put('/users/me');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Missing user slug');
    });
    test('should modify user favourites', async () => {
      const client = await pool.connect();
      try {
        await client.query(`
            INSERT INTO "users" ("id", "slug", "favourites", "createdAt", "updatedAt")
            VALUES (1, 'senior-candidate', ARRAY ['1'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
          `);
      } finally {
        client.release();
      }
      const res = await agent
        .put('/users/me')
        .set({ 'x-api-key': KEY, 'x-slug': 'c2VuaW9yLWNhbmRpZGF0ZQ==' })
        .send({ favourites: ['1', '2'] });
      expect(res.statusCode).toEqual(200);
      expect(res.body.favourites).toEqual(['1', '2']);
      expect(res.body.slug).toEqual('senior-candidate');
    });
  });
});
