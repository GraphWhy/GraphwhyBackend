var mongoose = require('mongoose');
var QuestionSchema = mongoose.Schema;
var Question = new QuestionSchema({
  prompt: String,
  answers: [Object],
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
  responses: [String]
});

module.exports.model = mongoose.model("question_graphwhy", Question);


