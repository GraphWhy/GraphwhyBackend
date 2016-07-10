"use strict";

var request = require('supertest');
var util = require('../util.js');
var auth = require('./auth.js');

const ENDPOINT = 'question';

var userSession;
var adminSession;

describe('Questions', function() {
  before(function() {
    userSession = auth.getUserSession();
    adminSession = auth.getAdminSession();
  });
  it('should return all questions', function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });
  it('should require auth to delete all questions', function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to delete all questions', function(done) {
    userSession
      .delete(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should require auth to delete one question', function(done) {
    request(util.server)
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to delete one question', function(done) {
    userSession
      .delete(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should require auth to create question', function(done) {
    request(util.server)
      .post(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(401, done);
  });
  it('should require admin to create question', function(done) {
    userSession
      .post(util.API_PREFIX + ENDPOINT + '/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403, done);
  });
  it('should return 404 for non-existent question', function(done) {
    request(util.server)
      .get(util.API_PREFIX + ENDPOINT + '/' + util.FAKE_ID)
      .expect(404, done);
  });
});