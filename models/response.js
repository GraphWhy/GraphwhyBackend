var mongoose = require('mongoose');
var ResponseSchema = mongoose.Schema;
var Response = new ResponseSchema({
  vote: Number,
  user: String,
  question: String,
  createdAt: { type:Date, default: Date.now }

});

module.exports.model = mongoose.model("response_graphwhy", Response);


