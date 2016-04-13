var express = require('express');
var User = require('../models/user.js');

var router = express.Router();


//creates a user
//urlparams: POST:/api/users/
//post: 'email', 'password'
function createUser(req, res){
  //TODO: check if valid input
  var encryptedPasswordInput = require('crypto').createHash('md5').update(req.body.password).digest('hex');
  var tempUser = new User.model({
    email: req.body.email,
    password: encryptedPasswordInput
  });
  tempUser.save(function(err, data){
    if(err) res.send({status:400, data:null, message:err});
    return res.send({user:data})
  });
}
//prints out all users
//urlparams: GET:/api/users/
function readUsers(req, res){
  User.model.find({},function(err, users){
    var userMap = {};
    users.forEach(function(user){
      userMap[user._id] = user;
    })
    if(err) return res.send({status:400, data:null, message:err});
    else return res.send({status:200, data:userMap, message:"Fetching Users"});
  });
}
//reads a single user with phone param
//urlparams: GET:/api/v0.1/users/:id
function readUser(req, res){
  User.model.findOne({_id:req.params.id}, function(err, user){
    if(err) res.send({status:400, data:null, message:err});
    return res.send({user:user})
  });
}
//deletes a user
//urlparams: DELETE:/api/v0.1/users/:id
function deleteUser(req, res){
  User.model.findOne({_id:req.params.id}).remove(function(err){
    if(err) res.send({status:400, data:null, message:err});
    else res.send({response:'deleted '+ req.params.id});
  });
}
//deletes all users
//urlparams: DELETE:/api/v0.1/users/
function deleteUsers(req, res){
  User.model.remove().exec();
  res.send({status:200, data:null, message:"Deleted "+User});
}

function loginUser(req, res){
  User.model.findOne({_id:req.params.id}, function(err, user){
  if(err){
    return res.send({status:200, data:{login:false}, message:req.params.phone+" login attempt 1"})
  }else{
    if(!user){
      return res.send({status:200, data:{login:false}, message:req.params.phone+" login attempt 2"})
    }else{
      var p = require('crypto').createHash('md5').update(req.body.password).digest('hex');
      console.log(p);
      console.log(user)
      if(p==user.password){
        req.session.user = user;
      }else{
        return res.send({status:200, data:{login:false}, message:req.params.phone+" login attempt 3"})
      }
    }
  }
  return res.send({status:200, data:{login:true}, message:req.params.phone+" login attempt 4"})
  });
}

//crud user
router.post('/', createUser);
router.get('/', readUsers);
router.get('/:id', readUser);
router.post('/:id', loginUser);
router.delete('/', deleteUsers);
router.delete('/:id', deleteUser);


module.exports = router;
