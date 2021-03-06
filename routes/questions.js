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
    Question.model.findOne({_id:req.params._id}).remove(function(err){
      console.log(err)
    });
  }))
  Promise.all(promises).then(function(d){
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

var statsreal = {};

function getStats(){
  Response.model.find({},function(err, users){
    var responses = []
    var fakequestions = [];

    users.forEach(function(user){
      responses.push(user);
      //fakequestions.pushifnotexist(user._id);
    })
    /* begin sample data create, creates own questions*/
    const questionAmount = 10;
    const userAmount = 100;
    /*
    for(var tempuserindex = 0; tempuserindex < userAmount; tempuserindex++){
      for(var questionindex = 0; questionindex < questionAmount; questionindex++){
        var responseObj = {
          //vote: parseInt(Math.pow(Math.random(), 2)*10), //skew random
          vote: parseInt(Math.random()*10), //complete random
          user: tempuserindex,
          question: questionindex,
          _id: questionindex,
          _v: 0,
          createdAt: Date.now()
        }
        //console.log(Math.pow(Math.random(), 2)*10);
        responses.push(responseObj)
      }
    }
    /* end sample data create*/
    /* begin sample data create, uses own questions 
    for(var tempuserindex = 0; tempuserindex < userAmount; tempuserindex++){
      for(var questionindex = 0; questionindex < fakequestions.length; questionindex++){
        var responseObj = {
          //vote: parseInt(Math.random()*10),
          vote: parseInt(Math.pow(Math.random(), 2)*10),
          user: tempuserindex,
          question: fakequestions[questionindex],
          _id: questionindex,
          _v: 0,
          createdAt: Date.now()
        }
        responses.push(responseObj)
      }
    }
    /* end sample data create*/
    /* begin grab unique question ids in response */
    /* stats is a key of questions and responces by the user*/
    var stats = {};
    for(var r = 0; r < responses.length; r++){
      stats[ responses[r].user ] =[];
    } 
    for(var r = 0; r < responses.length; r++){
      stats[responses[r].user].push({q:responses[r].question,v:responses[r].vote })
    }
  

    for(var v in stats){
      for(var i = 0; i < stats[v].length; i++){
        for(var x = 0; x < stats[v].length; x++){
          if(i!=x){
            if(!statsreal[stats[v][i].q+'-'+stats[v][x].q]){
              statsreal[stats[v][i].q+'-'+stats[v][x].q] = {[stats[v][i].v]: { [stats[v][x].v] : 1} };
            }            
            else if(!statsreal [stats[v][i].q+'-'+stats[v][x].q][stats[v][i].v]){
              statsreal[stats[v][i].q+'-'+stats[v][x].q][stats[v][i].v] = { [stats[v][x].v] : 1};
            }else{
              if(!statsreal [stats[v][i].q+'-'+stats[v][x].q][stats[v][i].v][stats[v][x].v]){
                statsreal[stats[v][i].q+'-'+stats[v][x].q][stats[v][i].v][stats[v][x].v] = 1;
              }else{
                statsreal[stats[v][i].q+'-'+stats[v][x].q][stats[v][i].v][stats[v][x].v] ++;
              }
            }
          }
        }
      }
    }

    var promises = [];
    for(v in statsreal){
      for(x in statsreal[v]){
        var total = 0;
        for(z in statsreal[v][x]){
          total += statsreal[v][x][z];
        }
        for(z in statsreal[v][x]){
          var x_id = v.split('-')[0];
          var z_id = v.split('-')[1];

          var valuex = Question.model.find({$or:[{_id:x_id},{_id:z_id}] }).then(function(data,ve){
            
            var promptx = ve[0].prompt ? ve[0].prompt : 'undefined';
            var promptz = ve[1].prompt ? ve[1].prompt : 'undefined';
            var votex = ve[0].answers[data[1]] ? ve[0].answers[data[1]].title : 'undefined';
            var votez = ve[1].answers[data[2]] ? ve[1].answers[data[2]].title : 'undefined';

            statsreal[data[0]][data[1]][data[2]].prompt = 
            statsreal[data[0]][data[1]][data[2]].percent + 
            '% of users who voted ' + votez + ' in ' + promptz + ' voted for ' + votex + ' in ' + 
            promptx;
              
            statsreal[data[0]][data[1]][data[2]].answer1 = votez;
            statsreal[data[0]][data[1]][data[2]].question1 = promptz;
            statsreal[data[0]][data[1]][data[2]].answer2 = votex;
            statsreal[data[0]][data[1]][data[2]].question2 = promptx;

          }.bind(null,[v,x,z,x_id,z_id]));

          promises.push(valuex);

          statsreal[v][x][z] = {
            prompt: '',
            percent:parseInt(statsreal[v][x][z]/total*100),
            amount:statsreal[v][x][z],
            answer1: '',
            question1:'',
            answer2:'',
            question2:''
          }
        }
      }
    }
    Promise.all(promises).then(function(d){
      return res.send(statsreal)
    })
  });
}
getStats();

function correlationFinder(req, res){
  res.send(statsreal);
}

function cleanResponses(req, res){
  var promises = [];
  if(!req.user) return res.send({error:'no login'})
  if(!req.user.admin) return res.send({error:'no admin'});
  Response.model.find({}, function(data){
    for(var i = 0; i < data.length; i++){
      var questionid = data.question;
      var qp = Question.model.find({_id:questionid}).then(function(err,question){
        if(!question){
           Response.model.findOne({_id:data._id}).remove(function(err){
            console.log(err)
          });
        }
      });
      promises.push(qp);
    }
  });

  Promise.all(promises).then(function(){
    res.send({status:200, data:null, message:"Deleted all"});
  })
}

/* pushes if unique */
Array.prototype.pushifnotexist = function(obj){
  for(var valueindex = 0; valueindex < this.length; valueindex++){
    if(this[valueindex]==obj){
      return;
    }
  }
  this.push(obj)
}


router.get('/correlation', correlationFinder);
router.get('/clean', cleanResponses);
router.get('/response', readResponses);
router.get('/vote/:_id/:answer', voteQuestion);
router.post('/addvote/:_id', addVote);
router.delete('/:_id', deleteQuestion);
router.get('/:_id', readQuestion);
router.delete('/', deleteQuestions);
router.post('/', createQuestion);
router.get('/', readQuestions);


module.exports = router;
