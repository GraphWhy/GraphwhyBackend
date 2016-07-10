"use strict";

const SERVER_SCRIPT = __dirname + '/../app.js';
const SERVER_URL = 'http://localhost:3010';
const API_PREFIX = '/api/v0.1/';
var fs = require('fs');
var request = require('supertest');
var server = null;

// If the server startup script exists, pass that to superagent. Otherwise, use the server URL. This is designed to
// support load testing using these integration tests running on multiple clients.
try {
  fs.statSync(SERVER_SCRIPT);
  server = require(SERVER_SCRIPT);
} catch(err) {
  if(err.code === 'ENOENT') {
    server = SERVER_URL;
  } else {
    throw err;
  }
}

module.exports.API_PREFIX = API_PREFIX;
module.exports.FAKE_ID = 'fakeid';
module.exports.server = server;