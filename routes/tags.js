"use strict";

var express = require('express');
var Tag = require('../models/tag.js');
var Question = require('../models/question.js');
var Response = require('../models/response.js');
var util = require('./util.js');

var router = express.Router();

function createTag(req, res) {
  if(util.isUser(req, res)) {
    var tag = new Tag.model({
      title: req.body.title,
      createdby: req.user._id
    });
    tag.save(function (err, data) {
      if (err) res.send({status: 400, data: null, message: err});
      res.status(201).send(data);
    });
  }
}

function readTags(req, res) {
  Tag.model.find({},function(err, tags) {
    if(err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(tags)
    }
  });
}

function readTag(req, res) {
  Tag.model.findOne({_id:req.params._id},function(err, data) {
    if (err) {
      return res.status(404).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
}

function deleteTag(req, res){
  if(util.isAdmin(req, res)) {
    Tag.model.findOne({_id: req.params.id}).remove(function(err) {
      if (err) res.status(400).send(err);
      else res.status(200).send('deleted ' + req.params.id);
    });
  }
}

function deleteTags(req, res){
  if(util.isAdmin(req, res)) {
    Tag.model.remove().exec();
    res.send({status:200, data:null});
  }
}

function getQuestion(req, res){
  var hit = false;
  if(!req.user) return res.send({error:'no login'})
  Response.model.find({user: req.user._id}, function (err, respns) {
    if(err) return res.send(err);
    if(!respns) return res.send('no response');
    Tag.model.findOne({title:req.params._id.split("_").join(" ")}, function(err, tag){
      if(!tag) return res.send('no tag');
      for(var z = 0; z < tag.questions.length; z++){
        var matched = false;
        for(var i = 0; i < respns.length; i++){
          if(tag.questions[z] == respns[i].question){
            matched = true;
          }
        }
        if(!matched && !hit){
          hit = true;
          Question.model.findOne({_id:tag.questions[z]}, function(err, question){
            if(err) return res.send(err)
            if(!question) return res.send('no question');
            return res.send(question)
          });
        }
      }
      if(!hit) return res.send('finished set')
    })
  });
}

function readQuestionsForTag(req, res){
    Tag.model.findOne({title:req.params.title}, function(err, tag){
    if(err){
      return res.send(err);
    }else{
        Question.model.find({_id: { $in: tag.questions}}, function(err, questions){
          res.send(questions);
        });
    }});
}

// router.get('/:_id', getQuestion);
router.delete('/:_id', deleteTag);
router.delete('/', deleteTags);
router.get('/:_id', readTag);
router.post('/', createTag);
router.get('/', readTags);
router.get('/:title/all', readQuestionsForTag);

module.exports = router;
