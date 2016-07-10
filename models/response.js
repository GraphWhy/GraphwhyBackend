"use strict";

var mongoose = require('mongoose');
var ResponseSchema = mongoose.Schema;
var Response = new ResponseSchema({
  vote: Number,
  user: String,
  question: String,
  createdAt: { type:Date, default: Date.now }

});

var collection_name = 'response';
if(process.env.NODE_ENV) {
  collection_name += '_' + process.env.NODE_ENV;
}

module.exports.model = mongoose.model(collection_name, Response);
