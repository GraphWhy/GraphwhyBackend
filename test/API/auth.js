const ADMIN_EMAIL = 'god@graphwhy.org';
const ADMIN_PASSWORD = 'pp';

const USER_EMAIL = 'user@graphwhy.org';
const USER_PASSWORD = 'poopoo';

const FAKE_USER_EMAIL = 'fakeuser@graphwhy.org';
const FAKE_USER_PASSWORD = 'fakepoo';

const LOGIN_ENDPOINT = 'user/login';
const LOGOUT_ENDPOINT = 'user/logout';

var request = require('supertest');
var session = require('supertest-session');
var util = require('../util.js');

var adminSession;
var userSession;

function getAdminSession() {
  if(!adminSession) {
    adminSession = session(util.server);
    adminSession
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: ADMIN_EMAIL, password: ADMIN_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (!res.body.login) {
          return done(new Error('Could not login admin.'));
        }
      });
  }
  return adminSession;
}

function getUserSession() {
  if(!userSession) {
    userSession = request.agent(util.server);
    userSession
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: USER_EMAIL, password: USER_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (!res.body.login) {
          return done(new Error('Could not login user.'));
        }
      });
  }
  return userSession;
}

describe('Authentication', function() {
  it('should login admin', function (done) {
    request(util.server)
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: ADMIN_EMAIL, password: ADMIN_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (!res.body.login) {
          return done(new Error('Could not login admin.'));
        }
        done();
      });
  });
  it('should login user', function (done) {
    request(util.server)
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: USER_EMAIL, password: USER_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (!res.body.login) {
          return done(new Error('Could not login user.'));
        }
        done();
      });
  });
  it('should send admin cookie', function (done) {
    request(util.server)
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: ADMIN_EMAIL, password: ADMIN_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (!res.headers['set-cookie']) {
          return done(new Error('Server did not send cookie.'));
        }
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        if (!/^session/.exec(cookies)) {
          return done(new Error('Server did not send cookie in correct format.'));
        }
        done();
      });
  });
  it('should send user cookie', function (done) {
    request(util.server)
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: USER_EMAIL, password: USER_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (!res.headers['set-cookie']) {
          return done(new Error('Server did not send cookie.'));
        }
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        if (!/^session/.exec(cookies)) {
          return done(new Error('Server did not send cookie in correct format.'));
        }
        done();
      });
  });
  it('should not login fake user', function (done) {
    request(util.server)
      .post(util.API_PREFIX + LOGIN_ENDPOINT)
      .send({email: FAKE_USER_EMAIL, password: FAKE_USER_PASSWORD})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        if (res.body.login) {
          return done(new Error('Logged in non-existent user.'));
        }
        if (res.headers['set-cookie']) {
          return done(new Error('Server sent cookie for failed login.'));
        }
        done();
      });
  });
});

module.exports.getAdminSession = getAdminSession;
module.exports.getUserSession = getUserSession;
