var express = require('express');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var Response = require('../models/response.js')

var router = express.Router();

function createQuestion(req, res){
  if(!req.user) return res.send({error:'no login'});
  var votes = new Array(req.body.answers.length);
  for (var i = votes.length-1; i >= 0; -- i) votes[i] = 0;
  var tempQuestion = new Question.model({
    'prompt': req.body.prompt,
    'explain': req.body.explain,
    'createdby' : req.user._id,
    'tags' : req.body.tags,
    'answers' : req.body.answers,
    'votes' : votes
  });
  for(var i = 0; i < tempQuestion.tags.length; i++){
    Tag.model.findOne({_id:tempQuestion.tags[i]}, function(err, tag){
      tag.questions.push(tempQuestion._id);
      tag.markModified('questions');
      tag.save();
    });
  }
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

function readResponses(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  Response.model.find({},function(err, users){
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
  Question.model.findOne({_id:req.params.id}, function(err, data){
    if(err) return res.send(err);
    for(var i = 0; i < data.tags.length; i++){
      Tag.model.findOne({_id:data.tags[i]}, function(err, data2){
        for(var v = 0; v < data2.questions.length; v++){
          if(data2.questions[v] == req.params.id){
            data2.questions.splice(i,1);
            data2.markModified('questions')
            data.save();
            return;
          }
        }
      })
    }
  })
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


function voteQuestion(req, res){
  if(!req.user) return res.send({error:'no login'})
  Response.model.find({user: req.user._id, question:req.params._id}, function (err, docs) {
    if (docs.length){
        return res.send('aready voted')
    }else{
      var answer = parseInt(req.params.answer);
      Question.model.findOne({_id:req.params._id},function(err, question){
        if(err) return res.send(err);
        if(!question) return res.send('no question')
        if(answer < question.votes.length && answer > -1){
          var tempResponse = new Response.model({
            vote: answer,
            user: req.user._id,
            question: question._id,
          });
          tempResponse.save(function(err){
            if(err) return res.send({status:400, data:null, message:err});
            question.votes[answer] += 1;
            question.markModified('votes');
            question.save(function(err2){
              if(err2) return res.send({status:400, data:null, message:err2});
              return res.send({question:"ok"})
            });
          })
         }else{
            return res.send({status:400, data:null, message:'out of bound vote number'})
         }
      });
    }
  });
}

function addVote(req, res){
  if(!req.user) return res.send({error:'no login'});
  Question.model.findOne({_id:req.params._id}, function(err, question){
    if(err) return res.send(err)
    if(!question) return res.send('no question');
    question.answers.push(req.body.option);
    question.votes.push(0);
    question.markModified('answers');
    question.markModified('votes');
    question.save(function(err2){
      if(err2) return res.send(err2);
      return res.send('added')
    })
  });
}


router.get('/response', readResponses);
router.get('/vote/:_id/:answer', voteQuestion);
router.post('/addvote/:_id', addVote);
router.delete('/:_id', deleteQuestion);
router.get('/:_id', readQuestion);
router.delete('/', deleteQuestions);
router.post('/', createQuestion);
router.get('/', readQuestions);


module.exports = router;
