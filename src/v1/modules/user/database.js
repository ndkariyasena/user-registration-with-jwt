const Schema = require('./user');

const { Counter } = require('@v1/modules/counters');

const { encryptText } = require('@v1/helpers');

/**
 *
 *
 * @param {*} userDetails
 * @returns
 */
const addNewUser = async (userDetails) => {

  userDetails['password'] = await encryptText(userDetails['password']);

  const counter = await Counter.getNextSequence('user');

  userDetails['id'] = `USRX${counter}__MtR${Math.floor(Math.random()*1000)}_T${new Date().getTime()}`;

  return await Schema.create(userDetails);

};

/**
 *
 *
 * @param {*} query
 * @param {*} [fields={}]
 */
const findOneByQuery = async (query, fields = {}) => await Schema.findOne(query, fields);

/**
 *
 *
 * @param {*} query
 * @param {*} options
 * @param {*} [fields={}]
 * @returns
 */
const findByQuery = async (query, options, fields = {}) => {

  const users = Schema.find(query, fields);

  if (options && options.sort) users.sort(options.sort);

  if (options && options.limit > 0) users.limit(options.limit);

  return await users;
};

/**
 *
 *
 * @param {*} query
 * @param {*} updates
 * @param {*} [options={}]
 */
const findOneByQueryAndUpdate = async (query, updates, options = {}) =>
  await Schema.findOneAndUpdate(query, updates, options);

module.exports = {

  addNewUser,

  findOneByQuery,

  findByQuery,

  findOneByQueryAndUpdate,
};