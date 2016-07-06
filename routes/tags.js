var express = require('express');
var Tag = require('../models/tag.js');
var Question = require('../models/question.js');
var Response = require('../models/response.js');

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
  Tag.model.findOne({_id:req.params._id},function(err, data){
    if(err) return res.send(err);
    return res.send(data);
  });
}

function readTagbyNum(req, res){
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


function spliceTag(req,res){
  Tag.model.findOne({_id:req.params._id}, function(err, tag){
    if(err) return res.send(err)
    if(!tag) return res.send('no tag');
    for(var i = 0; i < tag.questions.length; i++){
      if(req.params._id2 == tag.questions[i]){
        tag.questions.splice(i,1);
        tag.markModified('questions');
        tag.save(function(err,data){
          if(err) return res.send(err)
          return res.send('found and deleted')
        })
      }
    }
    return res.send('could not find')
  })
}
function readAll(req, res){
    Tag.model.findOne({title:req.params.title}, function(err, tag){
    if(err){ 
      return res.send(err);
    }else{
        Question.model.find({_id: { $in: tag.questions}}, function(err, questions){
          res.send(questions);
        });
    }});
}


function getQuestionsReact(req, res){
  Tag.model.findOne({title:req.params.title}, function(err,data){
    if(err) return res.send('error1')
    var promises = [];
    var arr = [];
    
    for(var i = 0; i < data.questions.length; i++){
      promises.push(Question.model.find({_id:data.questions[req.params.num]}, function(err1,question){
        if(err1) return res.send('error2');
        arr.push(question)
        return question;
      }));
    }
    
    Promise.all(promises).then(function(d){
      return res.send(arr)
    })
    
  });
}


router.get('/:_id', getQuestion);
router.get('/questions/:title', getQuestionsReact);
router.get('/splice/:_id/:_id2', spliceTag);
router.delete('/:_id', deleteTag);
router.delete('/', deleteTags);
//router.get('/:_id', readTag);
//router.get('/:_id/:num', readTagbyNum);
router.post('/', createTag);
router.get('/', readTags);
router.get('/:title/all', readAll);

module.exports = router;
