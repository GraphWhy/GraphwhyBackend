var express = require('express');
var gd = require('node-gd');
var fs = require('fs')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  gd.createTrueColor(200,200, function(error, img) {
    if (error) throw error;
    

    var questions = [1,4,3,6,5,3]


    var questions = [
      {answer:5,average:4,total:5},
      {answer:5,average:3,total:5},
      {answer:5,average:2,total:8},
      {answer:5,average:5,total:5},
      {answer:5,average:7,total:7},
      {answer:4,average:3,total:5}
    ]


    var rotation = 360/questions.length;
    var startpoint = { x: 100, y: 100};
    var userpoints = [];
    var basepoints = [];
    var averagepoints = [];
    var length = 80;

    for(var i = 0; i < questions.length; i++){
      var distance = questions[i].answer/questions[i].total*length;
      var x = (distance * Math.cos(((i*rotation-rotation/2) * Math.PI / 180.0)) + startpoint.x);
      var y = (distance * Math.sin(((i*rotation-rotation/2) * Math.PI / 180.0)) + startpoint.y);
      userpoints.push({x:x, y:y})
      distance = questions[i].average/questions[i].total*length;
      var x = (distance * Math.cos(((i*rotation-rotation/2) * Math.PI / 180.0)) + startpoint.x);
      var y = (distance * Math.sin(((i*rotation-rotation/2) * Math.PI / 180.0)) + startpoint.y);
      averagepoints.push({x:x, y:y})
      x = (length * Math.cos(((i*rotation-rotation/2) * Math.PI / 180.0)) + startpoint.x);
      y = (length * Math.sin(((i*rotation-rotation/2) * Math.PI / 180.0)) + startpoint.y);
      basepoints.push({x:x, y:y})
    }
    

    img.setThickness(4);
    img.polygon(basepoints, 0xFFFFFF);
    img.polygon(averagepoints, 0x99FF00);
    img.polygon(userpoints, 0xff0000);
    img.bmp(__dirname+'/../public/images/image.png', 0);
    res.sendFile("image.png", {"root": __dirname+'/../public/images'}, function(){
      fs.unlink(__dirname+'/../public/images/image.png');
    });
  });
});

module.exports = router;

