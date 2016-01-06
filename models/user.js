var mongoose = require('mongoose');
var UserSchema = mongoose.Schema;
var User = new UserSchema({
  email: String,
  password: String,
  history: [ {
    id: String,
    time: String 
  } ]
});

module.exports.model = mongoose.model("user_graphwhy", User);


