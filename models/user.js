var mongoose = require('mongoose');
var UserSchema = mongoose.Schema;
var User = new UserSchema({
  email: String,
  password: String,
  createdAt: { type:Date, default: Date.now },
  identities: String,
  responses: [String],
  clicked: Number,
  viewed: Number,
  timeOnSite: Number
});

module.exports.model = mongoose.model("user_graphwhy", User);

