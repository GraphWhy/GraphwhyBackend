var express = require('express');
var fs = require('fs')
var util = require('util'); 
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
});

router.get('/:tags', function(req, res, next){
   res.redirect('http://graphwhy.org/#/app/welcome/'+req.params.tags)
})

module.exports = router;

