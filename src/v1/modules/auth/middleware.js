/* cSpell: ignore errmsg */
const { verifyWebToken, decodeWebToken } = require('./authHelpers');

const Service = require('./service');

/**
 * Extract authorization header from request header
 *
 * @param {*} req { headers : { authorization } }
 * @returns
 */
const extractWebToken = (req) => {
  const { authorization } = req.headers;

  if( !authorization ) throw ({'errmsg': 'authenticate token not available'});

  if( !authorization.match(/Bearer\s/) ) throw ({'errmsg': 'Invalid authenticate token'});

  return authorization.split(' ')[1];
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateAuthToken = async (req, res, next) => {

  try {

    const token = extractWebToken(req);

    await verifyWebToken(token);

    const decode = await decodeWebToken(token);

    await Service.validateUserToken(decode);

    req.token = decode;

    next();

  } catch (error) {
    res.status(401).json(error);
  }
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const generateTokenForUser = async (req, res, next) => {

  try {

    const { user } = req;

    if( !user ) throw ({'errmsg': 'User not found'});

    const token = await Service.generatNewTokenForUser(user);

    req.token = token;

    next();

  } catch (error) {
    res.status(401).json(error);
  }

};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const cleanExpiredTokens = async (req, res, next) => {

  try {

    const { user } = req;

    if( !user ) throw ({'errmsg': 'User not found'});

    await Service.cleanExpiredTokensForUser(user);

    next();

  } catch (error) {
    res.status(401).json(error);
  }

};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const removeTokenFromUser = async (req, res, next) => {

  try {

    const token = extractWebToken(req);

    if( !token ) res.status(200);

    const decode = await decodeWebToken(token);

    await Service.removeTokenFromUser(decode);

    next();

  } catch (error) {
    res.status(200).json(error);
  }

};

module.exports = {
  validateAuthToken,

  generateTokenForUser,

  cleanExpiredTokens,

  removeTokenFromUser,
};