var express = require('express');
var gd = require('node-gd');
var fs = require('fs')
var util = require('util'); 
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
});

module.exports = router;

