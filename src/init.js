const initRoute = (message) => (req, res) => {

  res.status(200).json({

    message: message,

    application: process.env.APP_NAME,

    version: process.env.VERSION
  });
};

const completeTheRequest = async (req, res) => {

  try {

    const { token, user, response } = req;

    const responseData = {};

    if( token ) responseData['token'] = token;

    if( user ) responseData['user'] = user;

    if( response ) responseData['response'] = response;

    res.status(201).json(responseData);

  } catch (error) {
    const statusCode = ( error && error.statusCode ) ? error.statusCode : 500;

    res.status(statusCode).json(error);

  }
};

module.exports = {

  initRoute,

  completeTheRequest,
};