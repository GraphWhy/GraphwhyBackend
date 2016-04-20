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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'flklf;k43f;l43k21s12j112e21',
  duration: 30*60*1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req,res,next){
  if(req.session && req.session.user){
    User.model.findOne({ _id: req.session.user._id }, function(err,user){
      if(user){
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }
      next();
    });
  }else{
    next();
  }
});

mongoose.connect( "mongodb://localhost:27017/" , function (err, res) {
  if (err) {
  console.log ('Could not connect to mongodb://localhost:27017/' + err);
  } else {
  console.log ('Connected to mongodb://localhost:27017/');
}});

app.use('/', routes);
app.use('/api/user', users);
app.use('/api/fb', fb);
app.use('/api/tag', tags);
app.use('/api/question', questions)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
