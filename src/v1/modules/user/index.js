const service = require('./service');

const controller = require('./controller');

const middleware = require('./middleware');

const routes = require('./routes');

module.exports = {

  UserService: service,

  UserController: controller,

  UserMiddleware: middleware,

  UserRoutes: routes,
};
