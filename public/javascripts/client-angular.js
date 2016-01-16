(function(){                                                                     
var app = angular.module('myApp' , []);

app.controller('mainctrl', function($scope, $http, $location){
  $scope.lists = [];
  $.get('/api/lists', function(data){
    $scope.lists = data.data;
    $scope.$apply();
    
  })
});

})();  
