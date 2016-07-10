"use strict";

var request = require('supertest');
var util = require('../util.js');
var auth = require('./auth.js');

var userSession;
var adminSession;

const ENDPOINT = 'user';

describe('Users', function() {
  var idToRequest;

  before(function() {
    userSession = auth.getUserSession();
    adminSession = auth.getAdminSession();
  });
  it('should return all users',function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if(err) throw err;
        if(res.body.length != 3) {
          throw new Error('There are ' + res.body.length + ' users in the system. There should be 3.');
        }
        // Small hack to have an id to use in the next test
        idToRequest = res.body[0]._id;
        done();
      })
  });
  it('should return one user',function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/' + idToRequest)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        done();
      });
  });
  it('should return 404 for non-existent user',function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect(404, done);
  });
  it('should require auth to create user', function(done) {
    request(util.server)
      .post(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to create user', function(done) {
    userSession
      .post(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should verify email and password present before creating user', function(done) {
    adminSession
      .post(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400, done);
  });
  it('should create and return one user', function(done) {
    adminSession
      .post(util.API_PREFIX + ENDPOINT + '/')
      .send({email: 'usertocreate@graphwhy.org', password: 'hihi'})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end(function(err, res) {
        if(err) return done(err);
        if(!res.body.user) return done(new Error('User information not returned.'));
        done();
      });
  });
  it('should require auth to delete all users', function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to delete all users', function(done) {
    userSession
      .delete(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should require auth to delete one user',function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to delete one user',function(done) {
    userSession
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should delete one user', function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if(err) throw err;
        var idToDelete = null;
        res.body.forEach(function(user) {
          if(user.email === 'usertodelete@graphwhy.org') {
            idToDelete = user._id;
          }
        });
        if(!idToDelete) {
          return done(new Error('Email for user to delete not found: usertodelete@graphwhy.org'));
        }
        adminSession
          .delete(util.API_PREFIX + ENDPOINT + '/' + idToDelete)
          .expect(204, done);
      });
  });
});