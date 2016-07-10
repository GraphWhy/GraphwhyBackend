"use strict";

var express = require('express');
var User = require('../models/user.js');
var Response = require('../models/response.js');
var router = express.Router();
var request = require('request');

var util = require('./util.js');


//creates a user
//urlparams: POST:/api/users/
//post: 'email', 'password'
function createUser(req, res) {
  if(util.isAdmin(req, res)) {
    if(!req.body.email || !req.body.password) {
      return res.status(400).send('Email and password are required.');
    }
    User.model.find({email: req.body.email}, function (err, users) {
      if (users.length) {
        return res.status(403).send('This email is already registered: ' + req.body.email);
      } else {
        var encryptedPasswordInput = require('crypto').createHash('md5').update(req.body.password).digest('hex');
        var user = new User.model({
          email: req.body.email,
          password: encryptedPasswordInput,
          admin: false
        });
        user.save(function (err, data) {
          if(err) {
            res.status(400).send(err);
          } else {
            return res.status(201).send({user: data});
          }
        });
      }
    });
  }
}

//prints out all users
//urlparams: GET:/api/users/
function readUsers(req, res) {
  User.model.find({},function(err, users) {
    if(err) {
      return res.status(500).send(err);
    } else
      return res.status(200).send(users);
  });
}

//reads a single user with phone param
//urlparams: GET:/api/v0.1/users/:id
function readUser(req, res) {
  User.model.findOne({_id:req.params.id}, function(err, data) {
    if (err) {
      return res.status(404).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
}

//deletes a user
//urlparams: DELETE:/api/v0.1/users/:id
function deleteUser(req, res){
  if(util.isAdmin(req, res)) {
    User.model.findOne({_id: req.params.id}).remove(function (err) {
      if(err) {
        res.status(400).send(err);
      } else {
        res.status(204).send();
      }
    });
  }
}
//deletes all users
//urlparams: DELETE:/api/v0.1/users/
function deleteUsers(req, res){
  if(util.isAdmin(req, res)) {
    req.session.reset();
    User.model.remove().exec();
    res.status(204).send();
  }
}

function loginUser(req, res){
  User.model.findOne({email:req.body.email}, function(err, user){
    if(err){
      return res.status(200).send({login:false});
    } else if(!user){
        return res.status(200).send({login:false});
    } else if(user.social == true){
        return res.status(200).send({login:false});
    } else {
        var hashedPassword = require('crypto').createHash('md5').update(req.body.password).digest('hex');
        if(hashedPassword == user.password) {
          req.session.user = user;
          return res.status(200).send({login:true});
        } else {
          return res.status(200).send({login: false});
        }
    }
  });
}

function checkUser(req, res){
  if(!req.user){
    return res.send({logged:false});
  }else{
    return res.send({logged:true});
  }
}

function httpRequest(req, res){
request('http://sscproject.com/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    return res.send(body); // Show the HTML for the Google homepage.
  }
})
}

function socialLogin(req, res){
var options = {
  url: 'https://graph.facebook.com/me?fields=email',
  auth: {
    'bearer': req.body.token.access_token
  },
  fields: 'email'
};
function callback(error, response, body) {
var userData = JSON.parse(response.body);
console.log(userData.email);
    User.model.find({email: userData.email}, function (err, docs) {
    if (docs.length){
      //email is there, go to login
      console.log('User exists');
        
          req.session.user = docs;
          return res.send({status:200, data:{login:true}, message:" login attempt 4"});
    }else{
      //email is not in database create user then go to login
      var tempUser = new User.model({
        email: userData.email,
        social: true,
        admin: false
      });
      tempUser.save(function(err, data){
        if(err) res.send({status:400, data:null, message:err});
          return res.send({status:200, data:{login:true}, message:" login attempt 4"});
      });
    }
  });
  }
request(options, callback);
}

function logoutUser(req, res){
  req.session.reset();
  res.send('done');
}

//crud user
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/socialLogin', socialLogin);
router.get('/logout', logoutUser);
router.get('/', readUsers);
router.get('/check', checkUser);
router.get('/:id', readUser);
router.get('/http', httpRequest);
router.delete('/', deleteUsers);
router.delete('/:id', deleteUser);

module.exports = router;