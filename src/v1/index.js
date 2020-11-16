const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');

const { Swagger } = require('@config');

const { Database } = require('@config');

const { Definition, Apis } = Swagger;

const { DB_NAME } = process.env;

const options = {
  swaggerDefinition: Definition('V1'),
  apis: [
    ...Apis['V1'].map(api => `./src/v1/modules/${api}/swagger/*.yaml`), 
    './src/v1/*.yaml',
    './src/v1/swagger/*.yaml',
  ]
};

const swaggerSpec = swaggerJSDoc(options);

const getAPIJson = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  res.send(swaggerSpec);
};

module.exports = (app) => {

  app.get('/v1/swagger.json', getAPIJson);

  app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  Database.connect(DB_NAME);
};