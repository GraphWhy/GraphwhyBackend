var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var routes = require('./routes/index');
var users = require('./routes/users');
var questions = require('./routes/questions');
var fb = require('./routes/fb');
var tags = require('./routes/tags')
var session = require('client-sessions');
var User = require('./models/user.js');
var app = express();


mongoose.connect( "mongodb://localhost:27017/" , function (err, res) {
  if (err) {
  console.log ('Could not connect to mongodb://localhost:27017/' + err);
  } else {

      var encryptedPasswordInput = require('crypto').createHash('md5').update('pp').digest('hex');
      var tempUser = new User.model({
        email: 'pp',
        password: encryptedPasswordInput,
        admin: true
      });

      tempUser.save(function(err, data){
        if(err) res.send({status:400, data:null, message:err});
        return res.send({user:data})
      });
    
  }
});

