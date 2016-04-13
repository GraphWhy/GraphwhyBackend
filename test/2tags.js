var boot = require('../bin/www').boot,
  shutdown = require('../bin/www').shutdown,
  port = require('../bin/www').port,
  superagent = require('superagent'),
  expect = require('expect.js');

describe('tags', function () {
  describe('create', function(){
    it('should refuse to create a tag', function(done){
      superagent
        .post('http://localhost:'+port+'/api/tag')
        .send({
          'title':'testtag'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response).to.equal('cannot create question without logging in');
          titlename = res.body.title;
          done();
        })
    })
  })

  describe('login', function(){
    it('should login user', function(done){
      superagent
        .post('http://localhost:'+port+'/api/users/login')
        .send({
          'password':'watwat1001'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response).to.equal('testlist@gmail.com');
          userid = res.body.user._id;
          done();
        })
    })
  })

  var titlename;
  describe('create', function(){
    it('should create a tag', function(done){
      superagent
        .post('http://localhost:'+port+'/api/tag')
        .send({
          'title':'testtag'
        })
        .end(function(err, res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response.title).to.equal('testtag');
          titlename = res.body.response.title;
          done();
        })
    })
  })

  describe('show', function(){
    it('should show the tag', function(done){
      superagent
        .get('http://localhost:'+port+'/api/tag/'+titlename)
        .end(function(err,res){
          if(err) done(err)
          expect(res.status).to.equal(200);
          expect(res.body.response.title).to.equal('testtag');
          done();
        })
    })
  })

});
