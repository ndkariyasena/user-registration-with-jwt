const Schema = require('./auth');

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

  findOneByQuery,

  findByQuery,

  findOneByQueryAndUpdate,
};