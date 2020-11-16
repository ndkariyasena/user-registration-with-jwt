const express = require('express');

const Controller = require('./controller');

const { completeTheRequest } = require('@src/init');

const { AuthMiddleware } = require('@v1/modules/auth');

const router = express.Router();

router.route('/profile')
  .get(
    AuthMiddleware.validateAuthToken,
    Controller.getUserDetails,
    completeTheRequest
  );

module.exports = router;
