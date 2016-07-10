"use strict";

var request = require('supertest');
var util = require('./util.js');

module.exports = describe('Web server', function () {
  describe('index', function() {
    it('should respond to GET',function(done) {
      request(util.server)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    })
  })
});