require('module-alias/register');

require('dotenv').config();

const { PORT } = process.env;

const app = require('./src');

const onListeningLog = `User registration server is running on port : ${PORT}`;

app.listen(PORT, () => console.log(onListeningLog));

module.exports = app;
