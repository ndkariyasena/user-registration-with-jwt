const express = require('express');

const { UserRoutes } = require('./modules/user');

const router = express.Router();

const { initRoute, completeTheRequest } = require('../init');

const { AuthMiddleware } = require('@v1/modules/auth');

const { UserMiddleware } = require('@v1/modules/user');

const init = initRoute('User registration server v1 API server is working properly');

router.get('/', init);

router.route('/register')
  .post(
    UserMiddleware.validateUserDetails,
    UserMiddleware.createNewUser,
    AuthMiddleware.generateTokenForUser,
    completeTheRequest
  );

router.route('/login')
  .post(
    UserMiddleware.validateUserDetails,
    UserMiddleware.loginUser,
    AuthMiddleware.generateTokenForUser,
    completeTheRequest
  );

router.route('/logout')
  .post(
    AuthMiddleware.removeTokenFromUser,
    completeTheRequest
  );

router.use('/user', UserRoutes);

module.exports = router;
