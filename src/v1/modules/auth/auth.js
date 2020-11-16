const mongoose = require('mongoose');

const { Database } = require('@config');

const Schema = mongoose.Schema;

const { DB_NAME } = process.env;

const conn = Database.getConnection(DB_NAME);

mongoose.connection = conn;

const AuthSchema = new Schema({

  userId: { type: String, required: true, index: true, unique: true },

  tokens: [ {
    ref : { type: String },
    token : { type: String },
  } ],

}, { timestamps: true });

module.exports = mongoose.model('auth-token', AuthSchema);
