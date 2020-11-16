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

  beforeAll(async () => {
    Database.openConnections(DB_NAME_TEST);

    const temporaryDataObject = { ...MockData.completeUserDetailsSet };

    await request(app)
      .post('/v1/register')
      .send(temporaryDataObject)
      .expect('Content-Type', /json/);

  });

  afterAll(async () => {
    await UserDB.deleteMany();
    await AuthDB.deleteMany();
    await CounterDB.deleteMany();
  });

  afterAll(async () => {
    Database.disconnected(DB_NAME_TEST);
  });



  describe('User Login route : POST : /login', () => {


    it('01. Should FAIL when user-details are empty.', async () => {

      const res = await request(app)
        .post('/v1/login')
        .send(MockData.emptyUserDetailsSet)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(400);
      expect(res.body.errmsg).toEqual('User details not found');

    });


    it('02. Should FAIL when user-details are incomplete. Email missing:', async () => {

      const temporaryDataObject = { ...MockData.userDetailsSet_withEmail };
      delete temporaryDataObject.email;
      delete temporaryDataObject.firstName;
      delete temporaryDataObject.lastName;


      const res = await request(app)
        .post('/v1/login')
        .send(temporaryDataObject)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(400);
      expect(res.body.errmsg).toEqual('Email address or User name not found');

    });


    it('03. Should FAIL when user-details are incomplete. UserName missing:', async () => {

      const temporaryDataObject = { ...MockData.userDetailsSet_withUserName };
      delete temporaryDataObject.userName;
      delete temporaryDataObject.firstName;
      delete temporaryDataObject.lastName;

      const res = await request(app)
        .post('/v1/register')
        .send(temporaryDataObject)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(400);
      expect(res.body.errmsg).toEqual('Email address or User name not found');

    });


    it('04. Should SUCCESS when submit user-name and password', async () => {

      const temporaryDataObject = { ...MockData.userDetailsSet_withUserName };
      delete temporaryDataObject.firstName;
      delete temporaryDataObject.lastName;

      const res = await request(app)
        .post('/v1/login')
        .send(temporaryDataObject)
        .expect('Content-Type', /json/);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.id).toEqual(expect.stringMatching(/USRX\d{6}__MtR\d{3}_T\d{13}/));

    });


  });



});