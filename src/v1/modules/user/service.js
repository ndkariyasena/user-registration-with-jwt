/* cSpell:ignore errmsg */
const Database = require('./database');

const Constants = require('./constants');

const { compareHashValues } = require('@v1/helpers');

/**
 *
 *
 * @param {*} userDetails
 * @returns
 */
const _mapUserDetailsToExpose = (userDetails) => {

  if (!userDetails) throw ({ 'errmsg': 'User details not found for maping' });

  const responseData = {};

  for (const field in userDetails) {
    if (Constants.FIELDS_ALLOW_TO_EXPOSE.includes(field)) responseData[field] = userDetails[field];
  }

  return responseData;

};

/**
 *
 *
 * @param {*} { email, userName }
 * @returns
 */
const getUserByEmailOrUserName = async ({ email, userName }) => {

  if (!email && !userName ) throw ({ 'errmsg': 'Email address or User name must provide' });

  /* Try to find users in the database with new users' email and username */
  const usersSearchQuery = { '$or': [] };

  if( email ) usersSearchQuery['$or'].push({ email });

  if( userName ) usersSearchQuery['$or'].push({ userName });

  return await Database.findByQuery(usersSearchQuery);

};

/**
 *
 *
 * @param {*} id
 * @returns
 */
const getUserByUserId = async (id) => {

  if (!id ) throw ({ 'errmsg': 'User Id not found' });

  const userDetails = await Database.findOneByQuery({ id });

  if( !userDetails ) throw ({ 'errmsg': 'User not found', statusCode: 400 });

  return _mapUserDetailsToExpose(userDetails);

};

/**
 *
 *
 * @param {*} { email, userName, updates, options = {} }
 * @returns
 */
const updateUserByEmailOrUserName = async ({ email, userName, updates, options = {} }) => {

  if (!email && !userName ) throw ({ 'errmsg': 'Email address or User name must provide' });

  /* Try to find users in the database with new users' email and username */
  const usersSearchQuery = { '$or': [] };

  if( email ) usersSearchQuery['$or'].push({ email });

  if( userName ) usersSearchQuery['$or'].push({ userName });

  return await Database.findOneByQueryAndUpdate(usersSearchQuery, updates, options);

};

/**
 *
 *
 * @param {*} userDetails
 * @returns
 */
const createNewUser = async (userDetails) => {

  const usersMatchWithUniqueFields = await getUserByEmailOrUserName(userDetails);

  /* If found any : throw an error */
  if (usersMatchWithUniqueFields && usersMatchWithUniqueFields.length > 0) {

    const ErrorMessage = [];

    for (const existingUser of usersMatchWithUniqueFields) {
      if (existingUser.email === userDetails.email) ErrorMessage.push('This email already in use');

      if (existingUser.userName === userDetails.userName) ErrorMessage.push('This username already in use');
    }

    throw ({ 'errmsg': ErrorMessage });

  }

  /* Save user details */
  const newUser = await Database.addNewUser(userDetails);

  return _mapUserDetailsToExpose(newUser);

};

/**
 *
 *
 * @param {*} userDetails
 * @returns
 */
const loggedInUser = async ( userDetails ) => {

  const matchedUsers = await getUserByEmailOrUserName(userDetails);

  if( !matchedUsers || matchedUsers.length > 1 ) throw ({'errmsg': 'Data are miss matching'});

  if( matchedUsers.length === 0 ) throw ({'errmsg': 'User not found', 'statusCode' : 404});

  if( !compareHashValues(userDetails.password, matchedUsers[0].password) ) throw ({'errmsg': 'Incorrect password'});

  const userUpdates = {
    email: userDetails.email,
    userName: userDetails.userName,
    updates: { lastLogin: new Date() },
    option: { rawResult: true }
  };

  await updateUserByEmailOrUserName(userUpdates);

  return _mapUserDetailsToExpose(matchedUsers[0]);

};

/**
 *
 *
 * @param {*} userDetails
 * @returns
 */
const logOutUser = async ( userDetails ) => {

  const matchedUsers = await getUserByEmailOrUserName(userDetails);

  if( !matchedUsers || matchedUsers.length > 1 ) throw ({'errmsg': 'Data are miss matching'});

  if( matchedUsers.length === 0 ) throw ({'errmsg': 'User not found'});

  const userUpdates = {
    email: userDetails.email,
    userName: userDetails.userName,
    updates: { lastLogin: new Date() },
    option: { rawResult: true }
  };

  await updateUserByEmailOrUserName(userUpdates);

  return _mapUserDetailsToExpose(matchedUsers[0]);

};


module.exports = {

  createNewUser,

  getUserByUserId,

  getUserByEmailOrUserName,

  updateUserByEmailOrUserName,

  loggedInUser,

  logOutUser,

};