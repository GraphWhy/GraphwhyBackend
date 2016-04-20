var boot = require('../bin/www').boot,
  shutdown = require('../bin/www').shutdown,
  port = require('../bin/www').port,
  superagent = require('superagent'),
  expect = require('expect.js');

var userid, Cookies, titleid;

describe('users, tags, and questions', function () {

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

  describe('login', function(){
    it('should login user', function(done){
      superagent
        .post('http://localhost:'+port+'/api/users/login')
        .send({
          'email':'testlist@gmail.com',
          'password':'dog'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.data.login).to.equal(true);
          Cookies = res.headers['set-cookie'].pop().split(';')[0];
          done();
        })
    })
  })
  describe('checklogin', function(){
    it('should attempt login and return true', function(done){
      var req = superagent
        .get('http://localhost:'+port+'/api/users/check')

      req.cookies = Cookies;
      req.end(function(err, res){
        if(err) done(err)
        expect(res.status).to.equal(200);
        expect(res.body.logged).to.equal(true)
        done();
        })
    })
  })

  describe('create', function(){
    it('should fail to create tag due to no login', function(done){
      superagent
        .post('http://localhost:'+port+'/api/tag')
        .send({
          'title':'testtag2'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal('no login');
          done();
        })
    })
  })

  describe('create', function(){
    it('should create a tag after using session cookie', function(done){
      var req = superagent
        .post('http://localhost:'+port+'/api/tag')

        req.cookies = Cookies;
        req.send({
          'title':'testtag'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response.title).to.equal('testtag');
          titleid = res.body.response._id;
          done();
        })
    })
  })

  describe('show', function(){
    it('should show the tag', function(done){
      superagent
        .get('http://localhost:'+port+'/api/tag/'+titleid)
        .end(function(err,res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response.title).to.equal('testtag');
          done();
        })
    })
  })

  describe('delete', function(){
    it('should delete the tag', function(done){
      superagent
        .del('http://localhost:'+port+'/api/tag/'+titleid)
        .end(function(err,res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response).to.equal('deleted '+titleid);
          done();
        })
    })
  })


  var titlename;
  var titleid;
  var arr = ['1','2','3'];
  describe('create', function(){
    it('should fail to create a question due to no login', function(done){
      superagent
        .post('http://localhost:'+port+'/api/question')
        .send({
          'prompt':'test question',
          'answers': JSON.stringify(arr),
          'explain': 'dogshit',
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal('no login')
          done();
        })
    })
  })

  describe('create', function(){
    it('should create a question', function(done){
      var req = superagent
        .post('http://localhost:'+port+'/api/question');
        req.cookies = Cookies;
        req
        .send({
          'prompt':'test question',
          'answers': JSON.stringify(arr),
          'explain': 'dogshit',
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response.prompt).to.equal('test question');
          expect(res.body.response.answers[1]).to.equal('2');
          expect(res.body.response.explain).to.equal('dogshit');
          titleid = res.body.response._id;
          done();
        })
    })
  })

  describe('show', function(){
    it('should show the question', function(done){
      superagent
        .get('http://localhost:'+port+'/api/question/'+titleid)
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response.prompt).to.equal('test question');
          expect(res.body.response.answers[1]).to.equal('2');
          expect(res.body.response.explain).to.equal('dogshit');
          titleid = res.body.response._id;
          done();
        })
    })
  })

  describe('delete', function(){
    it('should delete the question', function(done){
      superagent
        .del('http://localhost:'+port+'/api/question/'+titleid)
        .end(function(err,res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response).to.equal('deleted '+titleid);
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


