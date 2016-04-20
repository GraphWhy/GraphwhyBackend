(function(){
var app = angular.module('myApp' , []);

var url = "http://localhost:3010/api/";

app.controller('mainctrl', function($scope, $http, $location, $http){
  $scope.loggedin = false;
  $scope.login = function(){
    var _email = $('#ele_email').val();
    var _password = $('#ele_password').val();
    $http.post(url+"user/login", {email:_email,password:_password}).success(function(data){
      $scope.loggedin = data.data.login;
    });
  }
  $scope.check = function(){
    $http.get(url+"user/check").success(function(data){
      $scope.loggedin = data.logged;
    })
  }
  $scope.logout = function(){
    $http.get(url+"user/logout");
    $scope.loggedin = false;
  }
  $scope.check();
});

app.controller('tagsnquestionsctrl', function($scope, $http, $location, $http){
  $scope.tags = [];
  $scope.questions = [];
  $scope.createTag = function(){
    var _title = $('#ele_title').val();
    $http.post(url+"tag/",{title:_title}).success(function(data){
      $scope.updateTags();
    })
  }
  $scope.updateTags = function(){
    $http.get(url+"tag").success(function(data){
      $scope.tags = data.data;
    })
  }
  $scope.deleteTag = function(_id){
    $http.delete(url+"tag/"+_id).success(function(data){
      $scope.updateTags();
    })
  }

  $scope.deleteQuestion = function(_id){
    $http.delete(url+"question/"+_id).success(function(data){
      $scope.updateQuestions();
    })
  }
  $scope.updateQuestions = function(){
    $http.get(url+"question").success(function(data){
      $scope.questions = data.data;
    })
  }
  $scope.createQuestion = function(){
    var _arr = [];
    var _prompt = $('#ele_prompt').val();
    var _explain = $('#ele_explain').val();
    var _tag = $('#ele_option').val();
    jQuery("input[name='option[]']").each(function() {
      _arr.push( this.value  );
    });
    $http.post(url+"question", {
      prompt:_prompt,
      explain: _explain,
      answers: _arr,
      tags: _tag
    }).success(function(data){
      $scope.updateQuestions();
    })
  }
  $scope.updateQuestions();
  $scope.updateTags();
});

})();
