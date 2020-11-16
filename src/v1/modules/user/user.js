const mongoose = require('mongoose');

const { Database } = require('@config');

const Schema = mongoose.Schema;

const { DB_NAME } = process.env;

const conn = Database.getConnection(DB_NAME);

mongoose.connection = conn;

const UserSchema = new Schema({

  id: { type: String, required: true, index: true, unique: true },

  email: { type: String, require: true, index: true, unique: true },

  userName: { type: String, require: true, index: true, unique: true },

  firstName: { type: String },

  lastName: { type: String },

  lastLogin: { type: Date, default: () => ( new Date() ) },

  password: { type: String, require: true },

}, { timestamps: true });

module.exports = mongoose.model('user', UserSchema);
