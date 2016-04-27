var mongoose = require('mongoose');
var TagSchema = mongoose.Schema;
var Tag = new TagSchema({
  title: String,
  createdby: String,
  questions: [String],
  createdAt: { type:Date, default: Date.now }
});

module.exports.model = mongoose.model("tag_graphwhy", Tag);

