var express = require('express');
var Question = require('../models/question.js');
var Tag = require('../models/tag.js');
var Response = require('../models/response.js')

var router = express.Router();

function createQuestion(req, res){
  if(!req.user) return res.send({error:'no login'});

  var tempQuestion = new Question.model({
    'prompt': req.body.prompt,
    'explain': req.body.explain,
    'createdby' : req.user._id,
    'tags' : req.body.tags,
    'type' : req.body.type
  }); 
  var tempArr =[];

  for(var i = 0; i < tempQuestion.tags.length; i++){
    Tag.model.findOne({_id:tempQuestion.tags[i]}, function(err, tag){
      tag.questions.push(tempQuestion._id);
      tag.markModified('questions');
      tag.save();
    });
  }
  if(req.body.type == 'multiplechoice'){
    tempQuestion.save(function(err, data){
      if(err) return res.send({status:400, data:null, message:err});
      for(var i = 0; i < req.body.answers.length; i++){
      var tempobj = {
        title: req.body.answers[i],
        votes: 0,
        created: Date.now
      };

      Question.model.findByIdAndUpdate(
          tempQuestion._id,
          {$push: {"answers": tempobj}},
          {safe: true, upsert: true, new : true},
          function(err, model) {
              console.log(err);
          }
      );
    }
      return res.send({response:data});
    });
  }else if (req.body.type == 'slider'){
    tempQuestion.save(function(err, data){
      if(err) return res.send({status:400, data:null, message:err});
      for(var i = 0; i < 10; i++){
      var tempobj = {
        title: i,
        votes: 0,
        created: Date.now
      };
      Question.model.findByIdAndUpdate(
          tempQuestion._id,
          {$push: {"answers": tempobj}},
          {safe: true, upsert: true, new : true},
          function(err, model) {
              console.log(err);
          }
      );
    }
      return res.send({response:data});
    });
  }else if (req.body.type == 'percent'){
    tempQuestion.save(function(err, data){
    if(err) return res.send({status:400, data:null, message:err});
    for(var i = 1; i < 101; i++){
    var tempobj = {
      title: i+'%',
      votes: 0,
      created: Date.now
    };
    Question.model.findByIdAndUpdate(
        tempQuestion._id,
        {$push: {"answers": tempobj}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);
        }
      );
    }
      return res.send({response:data});
    });
  }
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
  var promises = [];

  promises.push(Question.model.findOne({_id:req.params._id}, function(err, data){
    if(err) return res.send(err);
    if(!data) return res.send('no data')
    for(var i = 0; i < data.tags.length; i++){
      Tag.model.findOne({_id:data.tags[i]}, function(err, data2){
        for(var v = 0; v < data2.questions.length; v++){
          if(data2.questions[v] == req.params._id){
            data2.questions.splice(v,1);
            data2.markModified('questions')
            data2.save();
          }
        }
      })
    }
  }))
  Promise.all(promises).then(function(d){
    Question.model.findOne({_id:req.params._id}).remove(function(err){
      console.log(err)
    });
    return res.send('done')
  })
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
        if(answer < question.answers.length && answer > -1){
          var tempResponse = new Response.model({
            vote: answer,
            user: req.user._id,
            question: question._id,
          });
          tempResponse.save(function(err){
            if(err) return res.send({status:400, data:null, message:err});
            question.answers[answer].votes += 1;
            question.markModified('answers');

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

    var tempobj = {
      title: req.body.option,
      votes: 0,
      created: Date.now
    };

    Question.model.findByIdAndUpdate(
        question._id,
        {$push: {"answers": tempobj}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            res.send('done')
        }
    );
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
