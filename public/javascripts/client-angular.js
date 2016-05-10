(function(){
var app = angular.module('myApp' , []);

var url = "http://107.170.248.208:3010/api/";

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


})();
