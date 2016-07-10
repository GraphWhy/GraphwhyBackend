"use strict";

var mongoose = require('mongoose');
var TagSchema = mongoose.Schema;
var Tag = new TagSchema({
  title: String,
  createdby: mongoose.Schema.ObjectId,
  questions: [mongoose.Schema.ObjectId],
  createdAt: { type:Date, default: Date.now }
});

var collection_name = 'tag';
if(process.env.NODE_ENV) {
  collection_name += '_' + process.env.NODE_ENV;
}

module.exports.model = mongoose.model(collection_name, Tag);
