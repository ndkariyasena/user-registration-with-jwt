const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const router = require('./router');

const v1 = require('./v1');

const { JSON_PARSER_LIMIT } = process.env;

const BODYPARSER = {
  JSON_PARSER: {
    limit: JSON_PARSER_LIMIT
  },

  URLENCODED: {
    limit: JSON_PARSER_LIMIT,
    extended: true,
  }
};

app.use(bodyParser.json(BODYPARSER.JSON_PARSER));

app.use(bodyParser.urlencoded(BODYPARSER.URLENCODED));

v1(app);

app.use('/', router);

module.exports = app;