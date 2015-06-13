'use strict';
var angular = require('angular');
// var template = require('./template/widget.html');
var template = '<div> <h1>Insert user:</h1> <input type="text" ng-model="user"> <button ng-click="rateMyGithub(user)"></button> </div> ';

angular
  .module('ng-github-rate', [])
  .controller('WidgetController', WidgetController)
  .provider('ngGithubRateConfig', ngGithubRateConfigProvider)
  .directive('ngGithubRate', ngGithubRate);

WidgetController.$inject = ['$scope', '$http', 'ngGithubRateConfig'];
function WidgetController($scope, $http, ngGithubRateConfig) {
  $scope.rateMyGithub = function rateMyGithub(user) {
    console.log('rateMyGithub %s', user);
    $http.get(ngGithubRateConfig._url + 'github-user?stream=true&user=' + user)
      .then(function (result) {
        alert(result);
      });
  }
}

function ngGithubRateConfigProvider() {
  var config = {
    url: function (_url) {
      config._url = _url;
      return config;
    },
    $get: function () { },
  };
  return config;
}

function ngGithubRate() {
  return {
    restrict: 'EA',
    controller: 'WidgetController',
    template: template,
  };
}
