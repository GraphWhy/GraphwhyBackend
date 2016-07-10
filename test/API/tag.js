"use strict";

var request = require('supertest');
var util = require('../util.js');
var auth = require('./auth.js');

const ENDPOINT = 'tag';

var userSession;
var adminSession;

describe('Tags', function() {
  var idToRequest;

  before(function() {
    userSession = auth.getUserSession();
    adminSession = auth.getAdminSession();
  });
  it('should return all tags',function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
      if(err) return done(err);
      if(res.body.length != 5) {
        return done(new Error('There are ' + res.body.length + ' tags in the system. There should be 5.'));
      }
      idToRequest = res.body[0]._id;
      done();
    })
  });
  it('should return one tag',function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/' + idToRequest)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        done();
      });
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
      .expect(401, done);
  });
  it('should require admin to delete all tags', function(done) {
    userSession
      .delete(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should require auth to delete one tag', function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to delete one tag', function(done) {
    userSession
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });

  // it('should delete tag with proper auth', function(done) {
  //   request(util.server)
  //     .
  //   }
});