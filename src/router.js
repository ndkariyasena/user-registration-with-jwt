const express = require('express');

const router = express.Router();

const V1Router = require('./v1/router');

const { initRoute } = require('./init');

const init = initRoute('User registration server is working properly');

// Check route
router.route('/').get(init);

// /v1
router.use('/v1', V1Router);

// 404 - Route not found
router.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'NOT_FOUND',
    success: false,
    error: {
      errmsg: `Route ${req.url} Not found.`,
      code: 404
    }
  });
});

// 500 - Any server error
router.use((err, req, res) => {
  res.status(500).send({
    code: 500,
    error: err
  });
});

module.exports = router;
