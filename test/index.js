"use strict";

if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'integration_test';
}

var fixtures = require('./fixtures.js');

describe('Application', function () {
  // Create the fixtures
  before(function() {
    fixtures.cleanup();
    fixtures.create();
  });
  after(function() {
    
  });
  require('./server.js');
  require('./API/index.js');
});
