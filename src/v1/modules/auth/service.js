/* cSpell:ignore upsert errmsg */
const Database = require('./database');

const AuthHelpers = require('./authHelpers');

/**
 *
 *
 * @param {*} { id }
 * @returns
 */
const generatNewTokenForUser = async ({ id }) => {

  const { tokenId, modifiedUserId } = AuthHelpers.modifyUserIdAndTokenId(id);

  const token = await AuthHelpers.generateWebToken({
    id: modifiedUserId,
    ref: tokenId,
  });

  const objectForDb = {
    ref: tokenId,
    token,
  };

  const findTokenByUsrIdQuery = { 'userId': id };

  let existingTokens = await Database.findOneByQuery(findTokenByUsrIdQuery);

  if (existingTokens) {
    existingTokens = await AuthHelpers.clearExpiredTokens(existingTokens);

    existingTokens.tokens.push( objectForDb );

  } else {
    existingTokens = {
      userId: id,
      tokens: [ objectForDb ]
    };

  }

  await Database.findOneByQueryAndUpdate( findTokenByUsrIdQuery, existingTokens, { upsert: true } );

  return token;

};

/**
 *
 *
 * @param {*} { id }
 * @returns
 */
const cleanExpiredTokensForUser = async ({ id }) => {

  const findTokenByUsrIdQuery = { 'userId': id };

  let existingTokens = await Database.findOneByQuery(findTokenByUsrIdQuery);

  if (existingTokens) {
    existingTokens = await AuthHelpers.clearExpiredTokens(existingTokens);

    return await Database.findOneByQueryAndUpdate( findTokenByUsrIdQuery, { tokens : existingTokens.tokens } );
  }

  return null;

};

/**
 *
 *
 * @param {*} { id, ref }
 * @returns
 */
const removeTokenFromUser = async ({ id, ref }) => {

  const findTokenByUsrIdQuery = { 'userId': id };

  let existingTokens = await Database.findOneByQuery(findTokenByUsrIdQuery);

  if (existingTokens) {
    existingTokens = await AuthHelpers.clearExpiredTokens(existingTokens, ref);

    return await Database.findOneByQueryAndUpdate( findTokenByUsrIdQuery, { tokens : existingTokens.tokens } );
  }

  return null;

};

/**
 *
 *
 * @param {*} { id, ref }
 * @returns
 */
const validateUserToken = async ({ id, ref }) => {

  const findTokenByUsrIdQuery = { 'userId': id };

  const existingTokens = await Database.findOneByQuery(findTokenByUsrIdQuery);

  if (existingTokens) {

    if( existingTokens.tokens ) {

      const tokenItem = existingTokens.tokens.find((item) => (item.ref === ref));

      if( !tokenItem ) throw ({'errmsg': 'Token validation failed', statusCode: 403});

      if(await AuthHelpers.verifyWebToken(tokenItem.token, true)) return true;
      
      const restOfTheTokens = existingTokens.tokens.filter((item) => (item.ref !== ref));

      await Database.findOneByQueryAndUpdate( findTokenByUsrIdQuery, { tokens: restOfTheTokens } );

    }
  }

  throw ({'errmsg': 'Token validation failed', statusCode: 403});

};

module.exports = {

  generatNewTokenForUser,

  cleanExpiredTokensForUser,

  removeTokenFromUser,

  validateUserToken,

};