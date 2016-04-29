(function(){
var app = angular.module('myApp');

var url = "http://localhost:3010/api/";

app.controller('tagsnquestionsctrl', function($scope, $http, $location, $http){
  $scope.tags = [];
  $scope.tagArray = [];
  $scope.questions = [];
  $scope.tagsUsed = [];
  $scope.search = 'a';

  $scope.TagsUsedToIdArray = function(){
    var tempArr = [];
    for(var i = 0; i < $scope.tagsUsed.length; i++){
      tempArr.push($scope.tagsUsed[i]._id)
    }
    return tempArr;
  }
  $scope.updateTagArray = function(){
    $scope.tagArray = [];
    for(var k in $scope.tags){
      $scope.tagArray.push($scope.tags[k])
    }
    console.log($scope.tagArray)
  }
  $scope.addTagUsed = function(tag){
    for(var i = 0; i < $scope.tagsUsed.length; i++){
      if($scope.tagsUsed[i]==tag) return;
    }
    $scope.tagsUsed.push(tag)
  }
  $scope.removeTagUsed = function(index){
    $scope.tagsUsed.splice(index,1);
  }
  $scope.createTag = function(){
    var _title = $('#ele_title').val();
    $http.post(url+"tag/",{title:_title}).success(function(data){
      $scope.updateTags();
    })
  }
  $scope.updateTags = function(){
    $http.get(url+"tag").success(function(data){
      $scope.tags = data.data;
      $scope.updateTagArray();
    })
  }
  $scope.deleteTag = function(_id){
    $http.delete(url+"tag/"+_id).success(function(data){
      console.log(data)
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
    var _tag = $scope.TagsUsedToIdArray();
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
