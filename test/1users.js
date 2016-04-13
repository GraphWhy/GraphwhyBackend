var boot = require('../bin/www').boot,
  shutdown = require('../bin/www').shutdown,
  port = require('../bin/www').port,
  superagent = require('superagent'),
  expect = require('expect.js');

var userid;

describe('users', function () {
  describe('create', function(){
    it('should create a temp user', function(done){
      superagent
        .post('http://localhost:'+port+'/api/users')
        .send({
          'email':'testlist@gmail.com',
          'password':'dog'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.user.email).to.equal('testlist@gmail.com');
          userid = res.body.user._id;
          done();
        })
    })
  })
  describe('show', function(){
    it('should show the user information', function(done){
      superagent
        .get('http://localhost:'+port+'/api/users/'+userid)
        .end(function(err,res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.user.email).to.equal('testlist@gmail.com');
          done();
        })
    })
  })
  describe('delete', function(){
    it('should delete the user', function(done){
      superagent
        .del('http://localhost:'+port+'/api/users/'+userid)
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response).to.equal('deleted '+userid)
          done();
        })
    })
  })

});


