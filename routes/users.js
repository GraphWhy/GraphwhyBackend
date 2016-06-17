var express = require('express');
var User = require('../models/user.js');
var Response = require('../models/response.js');
var router = express.Router();
var request = require('request');


//creates a user
//urlparams: POST:/api/users/
//post: 'email', 'password'
function createUser(req, res){
    User.model.find({email: req.body.email}, function (err, docs) {
    if (docs.length){
        return res.send('already used')
    }else{
      var encryptedPasswordInput = require('crypto').createHash('md5').update(req.body.password).digest('hex');
      var tempUser = new User.model({
        email: req.body.email,
        password: encryptedPasswordInput,
        admin: false
      });
      tempUser.save(function(err, data){
        if(err) res.send({status:400, data:null, message:err});
        return res.send({user:data})
      });
    }
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
  Response.model.find({user:req.user._id}, function(err,responses){
    if(err) return res.send(err)
    return res.send(responses);
  });
}
//deletes a user
//urlparams: DELETE:/api/v0.1/users/:id
function deleteUser(req, res){
  if(!req.user) return res.send({error:'no login'})
  if(!req.user.admin) return res.send({error:'no admin'});
  User.model.findOne({_id:req.params.id}).remove(function(err){
    if(err) res.send({status:400, data:null, message:err});
    else res.send({response:'deleted '+ req.params.id});
  });
}
//deletes all users
//urlparams: DELETE:/api/v0.1/users/
function deleteUsers(req, res){
  if(!req.user) return res.send({error:'no login'})
  if(!req.user.admin) return res.send({error:'no admin'});
  req.session.reset();
  User.model.remove().exec();
  res.send({status:200, data:null, message:"Deleted "+User});
}


function loginUser(req, res){
  User.model.findOne({email:req.body.email}, function(err, user){
    if(err){
      return res.send({status:200, data:{login:false}, message:" login attempt 1"});
    }else{
      if(!user){
        return res.send({status:200, data:{login:false}, message:" login attempt 2"});
      }else{
      if(user.social == true){
        return res.send({status:200, data:{login:false}, message:" That email is social"});
      }else{
        var p = require('crypto').createHash('md5').update(req.body.password).digest('hex');
        if(p==user.password){
          req.session.user = user;
          return res.send({status:200, data:{login:true}, message:" login attempt 4"});
        }else{
          return res.send({status:200, data:{login:false}, message:" login attempt 3"});
        }
      }
      }
    }
  });
}

function checkUser(req, res){
  if(!req.user){
    return res.send({logged:false})
  }else{
    return res.send({logged:true})
  }
}


//problem with undefined going to login if email is not undefined, but an error or something. only really need to worry if oauth fails. tight capsule as long as things go expectedly 
function socialLogin(req, res){
var social = {
  facebook: {
             url: 'https://graph.facebook.com/me?fields=email'
					},
  google: {
					 url: 'https://www.googleapis.com/plus/v1/people/me'
			   },
  getEmail: {
		facebook: function(response){
			            return JSON.parse(response.body).email;
              },
    google: function(response){
			            return JSON.parse(response.body).emails[0].value;
					  }
	}
}

var provider = req.body.social;
console.log(provider);
social[provider].auth =  {};
social[provider].auth.bearer =  req.body.token.access_token;
console.log(social[provider]);
var options = social[provider];
function callback(error, response, body) {
var email = social.getEmail[provider](response);
console.log(email);
if (email != undefined){
    User.model.find({email: email}, function (err, docs) {
    if (docs.length){
      //email is there, go to login
      console.log('User '+email+' exists');
        
          req.session.user = docs;
          return res.send({status:200, data:{login:true}, message:" Login success!"});
    }else{
      console.log('User '+email+' not found. Creating account.');
      //email is not in database create user then go to login
      var tempUser = new User.model({
        email: email,
        social: true,
        admin: false
      });
      tempUser.save(function(err, data){
        if(err) res.send({status:400, data:null, message:err});
          return res.send({status:200, data:{login:true}, message:" Login success!"});
      });
    }
  });
  }else{
          return res.send({status:200, data:{login:false}, message:" Token did not work with API."});
  }
}
request(options, callback);
}

function logoutUser(req, res){
  req.session.reset();
  res.send('done')
}

//crud user
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/socialLogin', socialLogin);
router.get('/logout', logoutUser);
router.get('/', readUsers);
router.get('/check', checkUser);
router.get('/questions', readUser);
//router.delete('/', deleteUsers);
router.delete('/:id', deleteUser);


module.exports = router;
