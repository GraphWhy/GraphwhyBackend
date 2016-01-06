var mongoose = require('mongoose');
var ListSchema = mongoose.Schema;
var List = new ListSchema({
  questions: [Object], //array of questions
  stats: {
    total: Number
  },
  history: [{ //if a user finishes all questions then he will appear in history
    id: String, 
    time : String
  }]
});

module.exports.model = mongoose.model("list_graphwhy", List);


