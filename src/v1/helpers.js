const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = process.env;

/**
 * Encrypt text values
 *
 * @param {String} textInput
 * @returns
 */
const encryptText = async (textInput) => {

  try {
    const salt = await bcrypt.genSaltSync(Number(SALT_ROUNDS));

    return await bcrypt.hashSync(textInput, salt);

  } catch (error) {
    throw Error(error);

  }

};

/**
 * Compare encrypted values
 *
 * @param {String} plainText
 * @param {String} hashedText
 * @returns
 */
const compareHashValues = (plainText, hashedText) => {
  return bcrypt.compareSync(plainText, hashedText);
};

/**
 * Validate email address format
 * 
 * @param {String} emailAddress
 * @returns
 */
const validateEmailAddress = emailAddress => {

  try {

    const validationRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const regexp = new RegExp(validationRegExp);

    return regexp.test(emailAddress);

  } catch (error) {
    throw Error(error);
  }

};

/**
 * Validate password format
 *
 * The string must contain at least 1 lowercase alphabetical character
 * The string must contain at least 1 uppercase alphabetical character
 * The string must contain at least 1 numeric character
 * The string must contain at least one special character
 * The string must be eight characters or longer
 *
 * @param {String} password
 * @returns
 */
const validatePassword = password => {

  try {
    const validationRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    const regexp = new RegExp(validationRegExp);

    return regexp.test(password);

  } catch (error) {
    throw Error(error);
  }

};

/**
 * Format error response
 *
 * @param {*} res
 * @param {*} errorMessage
 */
const Error_Response = (res, errorMessage) => {
  try {
    const statusCode = (errorMessage && errorMessage.statusCode) ? errorMessage.statusCode : 500;

    res.status(statusCode).json(errorMessage);
    
  } catch (error) {
    res.status(500).json(errorMessage);
  }

};

module.exports = {
  encryptText,

  compareHashValues,

  validateEmailAddress,

  validatePassword,

  Error_Response,
};