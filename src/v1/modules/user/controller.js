const Service = require('./service');

const { Error_Response } = require('@v1/helpers');

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
const getUserDetails = async (req, res) => {

  try {

    const { token } = req;

    const activeUser = await Service.getUserByUserId(token.id);

    res.status(200).json({user : activeUser});

  } catch (error) {
    Error_Response(res, error);
  }
};

module.exports = {

  getUserDetails,
};
