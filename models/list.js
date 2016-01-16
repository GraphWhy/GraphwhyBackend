var mongoose = require('mongoose');
var ListSchema = mongoose.Schema;
var List = new ListSchema({
  title: String,
  description: String,
  questions: [{ 
    title: String,
    answers: [{
      votes: Number,
      answer: String,
      history: [String]
    }],
    description: String,
  }]
});

module.exports.model = mongoose.model("list_graphwhy", List);

