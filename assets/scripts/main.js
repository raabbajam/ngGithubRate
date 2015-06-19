require('angular');
var bootstrap = require('bootstrap-styl');
var oboe = require('oboe');
var $ = require('jQuery');

require('angular-oboe');
require('ui-bootstrap');

angular
  .module('ghrate', ['ui.bootstrap'])
  .controller('WidgetController', WidgetController)
  .directive('widget', widget);

WidgetController.$inject = ['$http', '$scope'];
function WidgetController($http, $scope) {
  // $scope.showResult = true;
  $scope.data = {
    counter: {},
    userData: {},
    repoData: {},
  };
  $scope.tabs = [
    {active: true},
    {active: false},
    {active: false},
  ];
  $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];
  $scope.getData = function getData(user) {
    // var url = 'http://localhost:3000/github-user?stream=true&user=' + user;
    var url = 'json/' + user + '.json';
    var userObj = $scope.data.userData;
    var repos = $scope.data.repoData;
    $scope.showResult = true;

    userObj.username = user
    var counterObj = $scope.data.counter = {
      userData: 'counting..',
      getRepoContributors: 'counting..',
      getRepoDataForUser: 'counting..',
    };

    oboe(url)
      .node('!', function (result) {

        if (result.key === 'userData') {

          angular.extend(userObj, result.value);

        } else if (/getRepoDataForUser|getRepoContributors/.test(result.key)){

          var repoName = result.value.fullName;
          repos[repoName] = repos[repoName] || {};
          var repo = repos[repoName];
          angular.extend(repo, result.value);

        }

        $scope.data.counter[result.key] = {
          progress: result.progress,
          total: result.total
        };

        $scope.$digest();
      })
      .done(function () {
        console.log('DONE!!');
      })
      .error(function (error) {
        $scope.error = error;
      });
  }
}
function widget () {
  return {
    templateUrl: 'templates/widget.html'
  };
}
