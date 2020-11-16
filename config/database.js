const mongoose = require('mongoose');

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

const connections = [];

const connect = (database) => {

  const oldConnection = connections.find((c) => c.database === database);

  if (!oldConnection) {

    const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${database}`;

    mongoose.set('useCreateIndex', true);

    mongoose.set('useFindAndModify', false);

    const connection = mongoose.createConnection(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    connections.push({
      database: database,
      dbURL: dbURL,
      conn: connection
    });

    connection.on('connected', () => (console.log('Connection is open to ', dbURL)));

    connection.on('error', (err) => (console.error('Connection has occurred ' + err + 'error')));

    connection.on('disconnected', () => (console.log('Connection is disconnected')));

    process.on('SIGINT', () => {

      connection.close(() => {

        console.log('connection is disconnected due to application termination');

        process.exit(0);
      });

    });

    return connection;
  }

  return oldConnection;
};

const openConnections = () => {
  connect(DB_NAME);
};

const getConnection = (database) => {

  const connection = connections.find((c) => c.database === database);

  if (connection) return connection.conn;

  return connect(database);

};

const disconnected = (database) => {

  const connection = connections.find((c) => c.database === database);

  if (connection) {

    connection.conn.disconnected;

    const index = connections.findIndex((c) => c.database === database);

    connections.splice(index, 1);
  }

};

module.exports = {

  connect: connect,

  openConnections: openConnections,

  getConnection: getConnection,

  disconnected: disconnected,
};