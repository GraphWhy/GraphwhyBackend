var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var require = require('request')

router.get('/:test?', function(req, res, next) {
  var id = '872274976224449';
  var url = 'http%3A%2F%2Flocalhost%3A3001';
  var requrl ='https://www.facebook.com/dialog/oauth?client_id=' + id + '&redirect_uri=' + url + '&response_type=token';
  requestify.get(requrl);
  res.redirect('google.com')
});


module.exports = router;


