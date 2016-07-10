"use strict";

var mongoose = require('mongoose');
var QuestionSchema = mongoose.Schema;
var Question = new QuestionSchema({
  prompt: String,
  answers: [{
    title:String,
    votes: Number,
    createdAt: { type:Date, default: Date.now }
  }],
  explain: String,
  type: String,
  stats:{
    total: Number,
  },
  history: [{
      id: String,
      time : String
  }],
  tags: [String],
  createdAt: { type:Date, default: Date.now },
  createdby: String,
  responses: [String],
  type: { type: String, required: true, default: 'multiplechoice' }
});

var collection_name = 'question';
if(process.env.NODE_ENV) {
  collection_name += '_' + process.env.NODE_ENV;
}

module.exports.model = mongoose.model(collection_name, Question);
