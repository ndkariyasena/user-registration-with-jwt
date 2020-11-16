const Definition = () => ({
  swagger: '2.0',
  components: {},
  info: {
    title: 'User Registration API V1',
    version: require('../package.json').version,
    description: 'Endpoints to test the user registrations routes'
  },
  host: `${process.env.APP_URL}:${process.env.PORT}`,
  basePath: '/v1',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
    },
  },
  security: [{ bearerAuth: [] }],
});

const Apis = {
  'V1': ['user']
};

module.exports = {
  Definition,

  Apis
};