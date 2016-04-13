var boot = require('../bin/www').boot,
  shutdown = require('../bin/www').shutdown,
  port = require('../bin/www').port,
  superagent = require('superagent'),
  expect = require('expect.js');

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

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


  after(function () {
    shutdown();
  });
});

