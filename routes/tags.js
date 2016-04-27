var express = require('express');
var Tag = require('../models/tag.js');
var Question = require('../models/question.js');
var router = express.Router();

function createTag(req, res){
  if(!req.user) return res.send({error:'no login'});
  var tempTag = new Tag.model({
    title: req.body.title,
    createdby : req.user._id
  });
  tempTag.save(function(err, data){
    if(err) res.send({status:400, data:null, message:err});
    res.send({response:tempTag});
  });
}

function readTags(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Tag.model.find({},function(err, users){
    var userMap = {};
    users.forEach(function(user){
      userMap[user._id] = user;
    })
    if(err) return res.send({status:400, data:null, message:err});
    else return res.send({status:200, data:userMap, message:"Fetching Tags"});
  });
}

function readTag(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Tag.model.findOne({_id:req.params._id},function(err, data){
    if(err) return res.send(err);
    return res.send(data);
  });
}

function readTagbyNum(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Tag.model.findOne({_id:req.params._id}, function(err,data){
    if(req.params.num>=data.questions.length) return res.send('error');
    Question.model.findOne({_id:data.questions[req.params.num]}, function(err,question){
      return res.send(question)
    });
  })
}


function deleteTag(req, res){
  if(!req.user.admin) return res.send({error:'no admin'});
  Tag.model.findOne({_id:req.params._id}).remove(function(err){
    if(err) return res.send({status:400, data:null, message:err});
    return res.send({'response':'deleted '+req.params._id})
  });
}

function deleteTags(req, res){
  if(!req.user) return res.send({error:'no login'})
  if(!req.user.admin) return res.send({error:'no admin'});
  Tag.model.remove().exec();
  res.send({status:200, data:null, message:"Deleted all"});
}

router.delete('/:_id', deleteTag);
router.delete('/', deleteTags);
router.get('/:_id', readTag);
router.get('/:_id/:num', readTagbyNum);
router.post('/', createTag);
router.get('/', readTags);

module.exports = router;
