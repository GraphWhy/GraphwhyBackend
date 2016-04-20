var express = require('express');
var Question = require('../models/question.js');

var router = express.Router();

function createQuestion(req, res){
  if(!req.user) return res.send({error:'no login'});

  var arr = JSON.parse(req.body.answers);
  var tempQuestion = new Question.model({
    'prompt': req.body.prompt,
    'answers': arr,
    'explain': req.body.explain
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
  Question.model.findOne({_id:req.params._id}).remove(function(err){
    if(err) return res.send({status:400, data:null, message:err});
    return res.send({'response':'deleted '+req.params._id})
  });
}

router.delete('/:_id', deleteQuestion);
router.get('/:_id', readQuestion);
router.post('/', createQuestion);
router.get('/', readQuestions);

module.exports = router;
