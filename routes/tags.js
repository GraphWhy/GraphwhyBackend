var express = require('express');
var Tag = require('../models/list.js');

var router = express.Router();

function createTag(req, res){
  if(!req.user) return res.send({error:'no login'});

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
  Tag.model.findOne({_id:req.params._id},function(err, data){
    res.send({response:data});
  });
}


function deleteTag(req, res){
  Tag.model.findOne({_id:req.params._id}).remove(function(err){
    if(err) return res.send({status:400, data:null, message:err});
    return res.send({'response':'deleted '+req.params._id})
  });
}

router.delete('/:_id', deleteTag);
router.get('/:_id', readTag);
router.post('/', createTag);
router.get('/', readTags);

module.exports = router;
