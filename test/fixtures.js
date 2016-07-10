"use strict";

var Response = require('../models/response.js');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/';

// User data
var adminData = {
  email: 'god@graphwhy.org',
  password: 'pp'
};

var userData = {
  email: 'user@graphwhy.org',
  password: 'poopoo'
};

var userToDeleteData = {
  email: 'usertodelete@graphwhy.org',
  password: 'byebye'
};

var userTagData = [
  {
    title: 'Politics',
  },
  {
    title: 'Religion',
  }
]

var adminTagData = [
  {
    title: 'Sex',
  },
  {
    title: 'Drugs',
  },
  {
    title: 'Rock & Roll',
  }
]

function createTag(userID, title) {
}

function create() {
  var admin = new User.model({
    email: adminData.email,
    password: require('crypto').createHash('md5').update(adminData.password).digest('hex'),
    admin: true
  });
  admin.save(function (err, data) {
    if (err) throw err;
    var adminId = data._id;
    adminTagData.forEach(function(tag, index, array) {
      var adminTag = new Tag.model({
        title: tag.title,
        createdby: adminId
      });
      adminTag.save(function (err, data) {
        if (err) throw err;
        var tagId = data._id;
      });
    });
  });

  var user = new User.model({
    email: userData.email,
    password: require('crypto').createHash('md5').update(userData.password).digest('hex'),
    admin: false
  });
  user.save(function (err, data) {
    if (err) throw err;
    var userId = data._id;
    userTagData.forEach(function(tag, index, array) {
      var userTag = new Tag.model({
        title: tag.title,
        createdby: userId
      });
      userTag.save(function (err, data) {
        if (err) throw err;
        var tagId = data._id;
      });
    });
  });

  var userToDelete = new User.model({
    email: userToDeleteData.email,
    password: require('crypto').createHash('md5').update(userToDeleteData.password).digest('hex'),
    admin: false
  });
  userToDelete.save(function (err, data) {
    if (err) throw err;
  });
}

function createQuestions() {

}

function associateTags() {
  
}

function createResponses() {

}

function deleteResponses() {
  Response.model.remove().exec();
}

function deleteQuestions() {
  Question.model.remove().exec();
}

function deleteTags() {
  Tag.model.remove().exec();
}

function deleteUsers() {
  User.model.remove().exec();
}


module.exports.create = function() {
  create();
};

module.exports.cleanup = function() {
  deleteResponses();
  deleteQuestions();
  deleteTags();
  deleteUsers();
};

