var mongoose = require('mongoose');
var QuestionSchema = mongoose.Schema;
var Question = new QuestionSchema({
  prompt: String,
  answers: [String],
  votes: [Number],
  explain: String,
  type: String,
  stats:{
    total: Number,
  },
  history: [{//if a user finishes this question then he will appear in history
      id: String,
      time : String
  }],
  tags: [String],
  createdAt: { type:Date, default: Date.now },
  createdby: String
});

module.exports.model = mongoose.model("question_graphwhy", Question);


