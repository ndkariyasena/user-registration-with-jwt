/* cSpell:ignore errmsg */
const fs = require('fs');

const JWT = require('jsonwebtoken');

const PrivateKey = fs.readFileSync(process.env.KEY_FILE, 'utf8');

const { JWT_TOKEN_EXPIRES } = process.env;

/**
 * Generate web-tokens
 *
 * @param {*} data
 * @returns
 */
const generateWebToken = async (data) => {

  if (!data) throw ({ 'errmsg': 'Empty data found' });

  return JWT.sign(data, PrivateKey, { expiresIn: JWT_TOKEN_EXPIRES });
};

/**
 * Verify web-tokens
 *
 * @param {*} token
 * @param {boolean} [returnBoolean=false]
 * @returns
 */
const verifyWebToken = async (token, returnBoolean = false) => {

  if (!token) throw ({ 'errmsg': 'Token not found' });

  try {
    return JWT.verify(token, PrivateKey);

  } catch (error) {
    if (returnBoolean) return false;

    throw error;
  }

};

/**
 * Decode web-tokens
 *
 * @param {*} token
 * @returns
 */
const decodeWebToken = async (token, decodeUserId = true) => {

  if (!token) throw ({ 'errmsg': 'Token not found' });

  const decodedToken = JWT.decode(token, PrivateKey);

  if(decodeUserId) decodedToken.id = decodeModifiedUserId(decodedToken.id);

  return decodedToken;

};

/**
 * Modify user-id by shifting id-blocks
 * original user-id -> <USRX000001>__<MtR0000>_<Timestamp> { [A]__[B]_[C] }
 * modified user-id -> <MtR0000>_<Timestamp>_<USRX000001> { [C]_[B]_[A] }
 *
 * @param {*} userId
 * @returns
 */
const modifyUserIdAndTokenId = (userId) => {

  if (!userId) throw ({ 'errmsg': 'Data not found for modification' });

  const userIdParts = userId.replace('__', '_').split('_');

  const tokenId = `${userIdParts[1]}_${userIdParts[0]}_TKn${new Date().getTime()}`;

  const modifiedUserId = `${userIdParts[2]}_${userIdParts[1]}_${userIdParts[0]}`;

  return { tokenId, modifiedUserId };

};

/**
 * Reorder modified user-id
 *
 * @param {*} userId
 * @returns
 */
const decodeModifiedUserId = (userId) => {

  if (!userId) throw ({ 'errmsg': 'Data not found for decode' });

  const userIdParts = userId.split('_');

  const uId = `${userIdParts[2]}__${userIdParts[1]}_${userIdParts[0]}`;

  return uId;

};

/**
 * Remove expired web-tokens from the list
 *
 * @param {*} tokenDetails
 * @param {*} specificTokenId
 * @returns
 */
const clearExpiredTokens = async (tokenDetails, specificTokenId = null) => {

  if (!tokenDetails) throw ({ 'errmsg': 'Token details not found for cleanup' });

  const tokens = (tokenDetails.tokens && tokenDetails.tokens.length > 0) ? [...tokenDetails.tokens] : [];

  const valideTokensList = [];

  for (const item of tokens) {

    if (specificTokenId && item.ref === specificTokenId) continue;
    else if (await verifyWebToken(item.token, true)) valideTokensList.push(item);

  }

  tokenDetails.tokens = valideTokensList;

  return tokenDetails;

};

module.exports = {
  generateWebToken,

  verifyWebToken,

  decodeWebToken,

  modifyUserIdAndTokenId,

  decodeModifiedUserId,

  clearExpiredTokens,
};