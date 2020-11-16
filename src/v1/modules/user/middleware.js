/* cSpell:ignore errmsg */
const { validateEmailAddress, validatePassword } = require('@v1/helpers');

const Service = require('./service');

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateUserDetails = (req, res, next) => {

  try {

    const userDetails = req.body;

    if (!userDetails || Object.keys(userDetails).length === 0) throw ({ 'errmsg': 'User details not found' });

    if (!userDetails.email && !userDetails.userName) throw ({ 'errmsg': 'Email address or User name not found' });

    if (!userDetails.password) throw ({ 'errmsg': 'Password not found under user details' });

    if (userDetails.email && !validateEmailAddress(userDetails.email)) throw ({ 'errmsg': 'Invalid email address' });

    if (userDetails.password && !validatePassword(userDetails.password)) throw ({ 'errmsg': 'Invalid password' });

    next();

  } catch (error) {
    res.status(400).json(error);
  }

};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createNewUser = async (req, res, next) => {

  try {

    const createdUser = await Service.createNewUser(req.body);

    req.user = createdUser;

    next();

  } catch (error) {
    const statusCode = ( error && error.statusCode ) ? error.statusCode : 500;
    res.status(statusCode).json(error);

  }
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const loginUser = async (req, res, next) => {

  try {

    const loggedUser = await Service.loggedInUser(req.body);

    req.user = loggedUser;

    next();

  } catch (error) {
    const statusCode = ( error && error.statusCode ) ? error.statusCode : 403;
    
    res.status(statusCode).json(error);
    
  }
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const logOutUser = async (req, res, next) => {

  try {

    const loggedUser = await Service.loggedInUser(req.body);

    req.user = loggedUser;

    next();

  } catch (error) {
    const statusCode = ( error && error.statusCode ) ? error.statusCode : 403;
    
    res.status(statusCode).json(error);
    
  }
};

module.exports = {
  validateUserDetails,

  createNewUser,

  loginUser,

  logOutUser,
};