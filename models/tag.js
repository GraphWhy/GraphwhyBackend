var mongoose = require('mongoose');
var TagSchema = mongoose.Schema;
var Tag = new ListSchema({
  title: String
});

module.exports.model = mongoose.model("tag_graphwhy", List);

