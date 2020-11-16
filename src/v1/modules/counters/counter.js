/* cSpell:ignore upsert */
const mongoose = require('mongoose');

const { Database } = require('@config');

const Schema = mongoose.Schema;

const { DB_NAME } = process.env;

const conn = Database.getConnection(DB_NAME);

mongoose.connection = conn;

/* Schema */
const counterSchema = new Schema({

  _id: { type: String },

  seq: { type: Number, default: 0 },

}, { timestamps: true });
/*  */

counterSchema.statics.getNextSequence = async function ( counterName ) {

  if( !counterName ) return null;

  const ret = await this.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true
    }
  );

  return ret.seq.toString().padStart(6, '0');
};

module.exports = mongoose.model('counter', counterSchema);