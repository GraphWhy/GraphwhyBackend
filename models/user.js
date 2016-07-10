"use strict";

var mongoose = require('mongoose');
var UserSchema = mongoose.Schema;
var User = new UserSchema({
  email: {
        type: String,
        unique: true,
        index: true
    },
  admin: Boolean,
  password: String,
  social: false,
  createdAt: { type:Date, default: Date.now },
  identities: String,
  responses: [String],
  clicked: Number,
  viewed: Number,
  timeOnSite: Number
});

var collection_name = 'user';
if(process.env.NODE_ENV) {
  collection_name += '_' + process.env.NODE_ENV;
}

module.exports.model = mongoose.model(collection_name, User);
