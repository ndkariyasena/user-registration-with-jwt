require('dotenv').config();

const request = require('supertest');

const app = require('@src');

describe('Root routes', () => {

  describe('Server root route : GET', () => {

    it.skip('Should pass with 200 status code', async () => {

      const message = 'User registration server v1 API server is working properly';

      const res = await request(app)
        .get('/v1/')
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual(message);

    });

  });

});