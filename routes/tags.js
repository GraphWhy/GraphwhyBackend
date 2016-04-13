var express = require('express');
var Tag = require('../models/list.js');

var router = express.Router();

function createTag(req, res){
  var tempTag = new Tag.model({
    title: req.body.title,
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
  Tag.model.findOne({title:req.params._id},function(err, data){
    res.send({response:data});
  });
}

function addQuestion(req, res){
  Tag.model.findOne({_id:req.body._id},function(err, data){
    var optionsobj = [];
    for(var i = 0; i < req.body['option[]'].length; i++){
      optionsobj.push({
        votes: 0,
        answer: req.body['option[]'][i],
        history: []
      })
    }

    data.questions.push({
      title: req.body.title,
      answers: optionsobj,
      description: req.body.description,
    })
    data.save();
  res.redirect('/')
  });
}

function deleteTag(req, res){
  Tag.model.findOne({_id:req.params._id}).remove(function(err){
    if(err) res.send({status:400, data:null, message:err});
    return res.send({'response':'deleted '+req.params._id})
  });
}

router.get('/delete/:_id', deleteTag);
router.get('/:_id', readTag);
router.post('/', createTag);
router.get('/', readTags);
router.post('/question', addQuestion);

module.exports = router;
