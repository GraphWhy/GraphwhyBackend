var express = require('express');
var Question = require('../models/question.js');

var router = express.Router();

function createQuestion(req, res){
  if(!req.user) return res.send({error:'no login'});
  var tempQuestion = new Question.model({
    'prompt': req.body.prompt,
    'explain': req.body.explain,
    'createdby' : req.user._id,
    'tags' : req.body.tags,
    'answers' : req.body.answers
  });
  tempQuestion.save(function(err, data){
    if(err) return res.send({status:400, data:null, message:err});
    return res.send({response:data});
  });
}

function readQuestions(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Question.model.find({},function(err, users){
    var userMap = {};
    users.forEach(function(user){
      userMap[user._id] = user;
    })
    if(err) return res.send({status:400, data:null, message:err});
    else return res.send({status:200, data:userMap, message:"Fetching Questions"});
  });
}
function readQuestion(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Question.model.findOne({_id:req.params._id},function(err, data){
    if(err) return res.send({status:400, data:null, message:err});
    return res.send({response:data});
  });
}

function deleteQuestion(req, res){
  if(!req.user) return res.send({error:'no login'})
  if(!req.user.admin) return res.send({error:'no admin'});
  Question.model.findOne({_id:req.params._id}).remove(function(err){
    if(err) return res.send({status:400, data:null, message:err});
    return res.send({'response':'deleted '+req.params._id})
  });
}

function deleteQuestions(req, res){
  if(!req.user) return res.send({error:'no login'})
  if(!req.user.admin) return res.send({error:'no admin'});
  Question.model.remove().exec();
  res.send({status:200, data:null, message:"Deleted all"});
}

router.delete('/:_id', deleteQuestion);
router.get('/:_id', readQuestion);
router.delete('/', deleteQuestions);
router.post('/', createQuestion);
router.get('/', readQuestions);

module.exports = router;
