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

    const registerRes = await request(app)
      .post('/v1/register')
      .send(temporaryDataObject)
      .expect('Content-Type', /json/);

    TOKEN = registerRes.body.token;

  });

  afterAll(async () => {
    await UserDB.deleteMany();
    await AuthDB.deleteMany();
    await CounterDB.deleteMany();
  });

  afterAll(async () => {
    Database.disconnected(DB_NAME_TEST);
  });



  describe('User Profile route : POST : /profile', () => {

    it('01. Should FAIL with an error message when Token missing.', async () => {

      const res = await request(app)
        .get('/v1/user/profile')
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(401);
      expect(res.body.errmsg).toEqual('authenticate token not available');

    });

    it('02. Should logout without an error message.', async () => {

      const partOfTheExpectedResponse = {
        email: 'testemail@gmail.com',
        userName: 'helloUser',
        firstName: 'Sam',
        lastName: 'Depp',
      };

      const res = await request(app)
        .get('/v1/user/profile')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(MockData.emptyUserDetailsSet)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(200);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.id).toEqual(expect.stringMatching(/USRX\d{6}__MtR\d{3}_T\d{13}/));

      expect(res.body.user).toMatchObject(partOfTheExpectedResponse);

    });

  });



});