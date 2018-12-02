const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const busSchema = new Schema({
  busid: { type: String, unique: true},
  going: [String]
},{
  usePushEach: true
});

module.exports = mongoose.model('business', busSchema);
