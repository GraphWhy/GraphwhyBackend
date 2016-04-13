    var boot = require('../bin/www').boot,
      shutdown = require('../bin/www').shutdown,
      port = require('../bin/www').port,
      superagent = require('superagent'),
      expect = require('expect.js');

    describe('server', function () {
      before(function () {
        boot();
      });
    describe('homepage', function(){
      it('should respond to GET',function(done){
        superagent
          .get('http://localhost:'+port)
          .end(function(res){
            expect(res.status).to.equal(200);
            done()
        })
      })
    });
    var listid;
    describe('create', function(){
      it('should create a temp list', function(done){
        superagent
          .post('http://localhost:'+port+'/api/lists')
          .send({
            'title':'testlist',
            'description': 'testdescription'})
          .end(function(err, res){
            if(err) done(err)
            expect(res.status).to.equal(200);
            expect(res.body.list.title).to.equal('testlist');
            expect(res.body.list.description).to.equal('testdescription');
            listid = res.body.list._id;
            done();
          })
      })
    })
    describe('show', function(){
      it('should show the lists', function(done){
        superagent
          .get('http://localhost:'+port+'/api/lists')
          .end(function(err,res){
            if(err) done(err)
            expect(res.status).to.equal(200);
            done();
          })
      })
    })
    describe('delete', function(){
      it('should delete the temp list', function(done){
        superagent
          .get('http://localhost:'+port+'/api/lists/delete/'+listid)
          .end(function(err, res){
            if(err) done(err)
            expect(res.status).to.equal(200);
            expect(res.body.response).to.equal('deleted '+listid)
            done();
          })
      })
    })
    after(function () {
      shutdown();
    });
  });

