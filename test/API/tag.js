"use strict";

var request = require('supertest');
var util = require('../util.js');

const ENDPOINT = 'tag';

describe('Tags', function() {
  it('should return all tags',function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
      if(err) throw err;
      if(res.body.length != 5) {
        throw new Error('There are ' + res.body.length + ' tags in the system. There should be 5.');
      }
      done();
    })
  });
  it('should return 404 for non-existent tag', function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect(404, done);
  });
  it('should require auth to create tag', function(done) {
    request(util.server)
      .post(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require auth to delete all tags', function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should require auth to delete one tag', function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  // it('should delete tag with proper auth', function(done) {
  //   request(util.server)
  //     .
  //   }
});