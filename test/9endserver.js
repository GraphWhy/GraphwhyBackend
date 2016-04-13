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

describe('end server', function () {
  after(function () {
    shutdown();
  });
});

