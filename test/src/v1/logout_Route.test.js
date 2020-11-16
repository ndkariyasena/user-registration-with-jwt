/* cSpell:ignore errmsg */
require('dotenv').config();

const request = require('supertest');

const app = require('@src');

const UserDB = require('@v1/modules/user/user');
const AuthDB = require('@src/v1/modules/auth/auth');
const CounterDB = require('@src/v1/modules/counters/counter');

const { Database } = require('@config');
const MockData = require('./MockData');

const { DB_NAME_TEST } = process.env;

describe('Root routes', () => {

  let TOKEN = null;

  beforeAll(async () => {
    Database.openConnections(DB_NAME_TEST);

    const temporaryDataObject = { ...MockData.completeUserDetailsSet };

    const res = await request(app)
      .post('/v1/register')
      .send(temporaryDataObject)
      .expect('Content-Type', /json/);

    TOKEN = res.body.token;

  });

  afterAll(async () => {
    await UserDB.deleteMany();
    await AuthDB.deleteMany();
    await CounterDB.deleteMany();
  });

  afterAll(async () => {
    Database.disconnected(DB_NAME_TEST);
  });
  


  describe('User Logout route : POST : /logout', () => {

    it('01. Should logout with an error message when Token missing.', async () => {

      const res = await request(app)
        .post('/v1/logout')
        .send(MockData.emptyUserDetailsSet)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);
      expect(res.body.errmsg).toEqual('authenticate token not available');

    });

    it('02. Should logout without an error message.', async () => {

      const res = await request(app)
        .post('/v1/logout')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(MockData.emptyUserDetailsSet)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(201);

    });

  });



});