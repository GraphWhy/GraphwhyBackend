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

module.exports.model = mongoose.model("question_graphwhy", Question);


